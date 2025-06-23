const getPrimaryKeyValue = require('./get-primary-key-value')
const sendMessage = require('./send-message')
const removeDefunctValues = require('./remove-defunct-values')
const validateUpdate = require('./validate-update')
const { publishingConfig } = require('../config')
const delinkedSubsetCounter = require('./delinked-subset-counter')
const { ORGANISATION, DELINKED, D365 } = require('./types')

const DELINKED_SCHEME_TYPES = [DELINKED, D365]
const SHARED_TYPES = [ORGANISATION]

const needsSubsetFiltering = (type) => {
  if (DELINKED_SCHEME_TYPES.includes(type) && publishingConfig.subsetProcessDelinked) {
    return true
  }

  if (SHARED_TYPES.includes(type) && publishingConfig.subsetProcessDelinked) {
    return true
  }

  return false
}

const ensureSubsetFilterEstablished = async () => {
  if (publishingConfig.subsetProcessDelinked) {
    const status = delinkedSubsetCounter.getStatus()
    if (!status.subsetEstablished) {
      console.log('Establishing subset filter before processing...')
      const getUnpublishedDelinkedCalc = require('./delinkedCalculation/get-unpublished-delinked')
      await delinkedSubsetCounter.establishSubsetFilter(getUnpublishedDelinkedCalc)
      console.log('Subset filter established')
    }
  }
}

const processRecord = async (record, type, updatePublished) => {
  const sanitizedUpdate = removeDefunctValues(record)
  sanitizedUpdate.type = type
  const isValid = validateUpdate(sanitizedUpdate, type)

  if (!isValid) {
    return false
  }

  await sendMessage(sanitizedUpdate, type)
  const primaryKey = getPrimaryKeyValue(record, type)
  await updatePublished(primaryKey)

  if (DELINKED_SCHEME_TYPES.includes(type) && publishingConfig.subsetProcessDelinked) {
    delinkedSubsetCounter.trackProcessedDelinkedRecord(record, type)

    if (type === DELINKED) {
      delinkedSubsetCounter.incrementProcessedCount(1)
    }
  }

  return true
}

const processSequentially = async (records, type, updatePublished) => {
  let processed = 0

  for (const record of records) {
    if (needsSubsetFiltering(type) &&
        !delinkedSubsetCounter.shouldProcessDelinkedRecord(record, type)) {
      continue
    }

    const wasProcessed = await processRecord(record, type, updatePublished)
    if (wasProcessed) {
      processed++
    }
  }

  return processed
}

const processInParallel = async (records, type, updatePublished) => {
  if (DELINKED_SCHEME_TYPES.includes(type) && publishingConfig.subsetProcessDelinked) {
    return processSequentially(records, type, updatePublished)
  }

  const batchPromises = records.map(async (record) => {
    if (SHARED_TYPES.includes(type) && publishingConfig.subsetProcessDelinked) {
      if (!delinkedSubsetCounter.shouldProcessDelinkedRecord(record, type)) {
        return false
      }
    }

    const sanitizedUpdate = removeDefunctValues(record)
    sanitizedUpdate.type = type
    const isValid = validateUpdate(sanitizedUpdate, type)

    if (isValid) {
      await sendMessage(sanitizedUpdate, type)
      const primaryKey = getPrimaryKeyValue(record, type)
      await updatePublished(primaryKey)
      return true
    }
    return false
  })

  const results = await Promise.all(batchPromises)
  return results.filter(Boolean).length
}

const calculateBatchSize = (type, defaultBatchSize) => {
  if (type === DELINKED && publishingConfig.subsetProcessDelinked) {
    const status = delinkedSubsetCounter.getStatus()
    if (status.limitReached) {
      return 0
    }
    const remainingToProcess = status.targetAmount - status.processedCount
    return Math.min(defaultBatchSize, remainingToProcess)
  }

  return defaultBatchSize
}

const sendUpdates = async (type) => {
  if (!publishingConfig.publishingEnabled) {
    console.log('Publishing is disabled via publishingEnabled=false flag')
    return
  }

  if (needsSubsetFiltering(type)) {
    await ensureSubsetFilterEstablished()
  }

  if (type === DELINKED && publishingConfig.subsetProcessDelinked) {
    const status = delinkedSubsetCounter.getStatus()

    if (status.limitReached) {
      console.log(`Skipping ${type} processing - DELINKED scheme subset limit reached`)
      console.log('Current status:', status)
      return
    }

    console.log(`Processing ${type} with DELINKED scheme subset control active:`, status)
  } else if (type === DELINKED) {
    console.log('DELINKED scheme subset processing disabled - processing normally')
  }

  const getUnpublished = require(`./${type}/get-unpublished`)
  const updatePublished = require(`./${type}/update-published`)

  let totalPublished = 0
  const batchSize = publishingConfig.dataPublishingMaxBatchSizePerDataSource

  let outstanding = []
  do {
    if (type === DELINKED && publishingConfig.subsetProcessDelinked && !delinkedSubsetCounter.shouldProcessDelinked()) {
      console.log(`${type} subset limit reached, stopping batch processing`)
      break
    }

    const effectiveBatchSize = calculateBatchSize(type, batchSize)
    if (effectiveBatchSize === 0) {
      break
    }

    outstanding = await getUnpublished(null, effectiveBatchSize)

    if (outstanding.length) {
      let processed = 0

      if (DELINKED_SCHEME_TYPES.includes(type) && publishingConfig.subsetProcessDelinked) {
        processed = await processSequentially(outstanding, type, updatePublished)
      } else {
        processed = await processInParallel(outstanding, type, updatePublished)
      }

      totalPublished += processed
    }

    if (type === 'calculation' && outstanding.length > 0) {
      break
    }

    if (type === DELINKED && publishingConfig.subsetProcessDelinked && !delinkedSubsetCounter.shouldProcessDelinked()) {
      console.log(`${type} subset limit reached, stopping further processing`)
      break
    }
  } while (outstanding.length === batchSize)

  console.log(`${totalPublished} ${type} datasets published`)
}

module.exports = sendUpdates
