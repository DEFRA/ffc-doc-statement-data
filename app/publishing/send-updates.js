const getPrimaryKeyValue = require('./get-primary-key-value')
const sendMessage = require('./send-message')
const removeDefunctValues = require('./remove-defunct-values')
const validateUpdate = require('./validate-update')
const { publishingConfig } = require('../config')
const delinkedSubsetCounter = require('./delinked-subset-counter')
const { DELINKED } = require('./types')

const sendUpdates = async (type) => {
  if (!publishingConfig.publishingEnabled) {
    console.log('Publishing is disabled via publishingEnabled=false flag')
    return
  }

  if (type === DELINKED && publishingConfig.subsetProcessDelinked) {
    const status = delinkedSubsetCounter.getStatus()

    if (status.limitReached) {
      console.log('Skipping delinked processing - subset limit reached')
      console.log('Current status:', status)
      return
    }

    console.log('Delinked subset processing active:', status)
  } else if (type === DELINKED) {
    console.log('Delinked subset processing disabled - processing normally')
  }

  const getUnpublished = require(`./${type}/get-unpublished`)
  const updatePublished = require(`./${type}/update-published`)
  let totalPublished = 0
  const batchSize = publishingConfig.dataPublishingMaxBatchSizePerDataSource

  let outstanding = []
  do {
    let effectiveBatchSize = batchSize
    if (type === DELINKED && publishingConfig.subsetProcessDelinked) {
      const status = delinkedSubsetCounter.getStatus()
      if (status.limitReached) {
        console.log('Delinked subset limit reached, stopping batch processing')
        break
      }
      const remainingToProcess = status.targetAmount - status.processedCount
      effectiveBatchSize = Math.min(batchSize, remainingToProcess)
    }

    outstanding = await getUnpublished(null, effectiveBatchSize)

    if (outstanding.length) {
      // !!Important: DELINKED with subset processing: sequential processing
      if (type === DELINKED && publishingConfig.subsetProcessDelinked) {
        for (const record of outstanding) {
          if (!delinkedSubsetCounter.shouldProcessDelinked()) {
            console.log('Delinked subset limit reached during processing, stopping')
            break
          }

          const sanitizedUpdate = removeDefunctValues(record)
          sanitizedUpdate.type = type
          const isValid = validateUpdate(sanitizedUpdate, type)

          if (isValid) {
            await sendMessage(sanitizedUpdate, type)
            const primaryKey = getPrimaryKeyValue(record, type)
            await updatePublished(primaryKey)
            totalPublished++
            delinkedSubsetCounter.incrementProcessedCount(1)
          }
        }
      } else {
        const batchPromises = outstanding.map(async (record) => {
          const sanitizedUpdate = removeDefunctValues(record)
          sanitizedUpdate.type = type
          const isValid = validateUpdate(sanitizedUpdate, type)

          if (isValid) {
            await sendMessage(sanitizedUpdate, type)
            const primaryKey = getPrimaryKeyValue(record, type)
            await updatePublished(primaryKey)
            totalPublished++
          }
        })
        await Promise.all(batchPromises)
      }
    }

    if (type === 'calculation' && outstanding.length > 0) {
      break
    }

    if (type === DELINKED && publishingConfig.subsetProcessDelinked) {
      if (!delinkedSubsetCounter.shouldProcessDelinked()) {
        console.log('Delinked subset limit reached, stopping')
        break
      }
    }
  } while (outstanding.length === batchSize)

  console.log(`${totalPublished} ${type} datasets published`)
}

module.exports = sendUpdates
