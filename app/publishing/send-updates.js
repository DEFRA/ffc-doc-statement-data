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
  return (DELINKED_SCHEME_TYPES.includes(type) && publishingConfig.subsetProcessDelinked) ||
         (SHARED_TYPES.includes(type) && publishingConfig.subsetProcessDelinked)
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
    if (SHARED_TYPES.includes(type) &&
        publishingConfig.subsetProcessDelinked &&
        !delinkedSubsetCounter.shouldProcessDelinkedRecord(record, type)) {
      return false
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

const shouldStopProcessing = (type) => {
  return type === DELINKED &&
         publishingConfig.subsetProcessDelinked &&
         !delinkedSubsetCounter.shouldProcessDelinked()
}

const processBatch = async (outstanding, type, updatePublished) => {
  if (!outstanding.length) {
    return 0
  }

  let processed = 0

  if (DELINKED_SCHEME_TYPES.includes(type) && publishingConfig.subsetProcessDelinked) {
    processed = await processSequentially(outstanding, type, updatePublished)
  } else {
    processed = await processInParallel(outstanding, type, updatePublished)
  }

  return processed
}

const shouldTerminateBatching = (type, outstandingLength) => {
  if (type === 'calculation' && outstandingLength > 0) {
    return true
  }

  if (shouldStopProcessing(type)) {
    console.log(`${type} subset limit reached, stopping further processing`)
    return true
  }

  return false
}

const setupProcessing = async (type) => {
  if (needsSubsetFiltering(type)) {
    await ensureSubsetFilterEstablished()
  }

  if (type === DELINKED && publishingConfig.subsetProcessDelinked) {
    const status = delinkedSubsetCounter.getStatus()

    if (status.limitReached) {
      console.log(`Skipping ${type} processing - DELINKED scheme subset limit reached`)
      console.log('Current status:', status)
      return false
    }

    console.log(`Processing ${type} with DELINKED scheme subset control active:`, status)
  } else if (type === DELINKED) {
    console.log('DELINKED scheme subset processing disabled - processing normally')
  } else {
    console.log(`Processing ${type} normally`)
  }

  return true
}

const sendUpdates = async (type) => {
  if (!publishingConfig.publishingEnabled) {
    console.log('Publishing is disabled via publishingEnabled=false flag')
    return
  }

  const shouldProceed = await setupProcessing(type)
  if (!shouldProceed) {
    return
  }

  const getUnpublished = require(`./${type}/get-unpublished`)
  const updatePublished = require(`./${type}/update-published`)

  let totalPublished = 0
  const batchSize = publishingConfig.dataPublishingMaxBatchSizePerDataSource

  await processBatches(type, getUnpublished, updatePublished, batchSize, (processed) => {
    totalPublished += processed
  })

  console.log(`${totalPublished} ${type} datasets published`)
}

const processBatches = async (type, getUnpublished, updatePublished, batchSize, onProcessed) => {
  let outstanding = []
  let shouldContinue = true

  while (shouldContinue) {
    shouldContinue = await processNextBatch()
  }

  async function processNextBatch () {
    if (shouldStopProcessing(type)) {
      console.log(`${type} subset limit reached, stopping batch processing`)
      return false
    }

    const effectiveBatchSize = calculateBatchSize(type, batchSize)
    if (effectiveBatchSize === 0) {
      return false
    }

    outstanding = await getUnpublished(null, effectiveBatchSize)
    const processed = await processBatch(outstanding, type, updatePublished)
    onProcessed(processed)

    if (shouldTerminateBatching(type, outstanding.length)) {
      return false
    }

    return outstanding.length === batchSize
  }
}

module.exports = sendUpdates
