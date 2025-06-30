const getPrimaryKeyValue = require('./get-primary-key-value')
const sendMessage = require('./send-message')
const removeDefunctValues = require('./remove-defunct-values')
const validateUpdate = require('./validate-update')
const { publishingConfig } = require('../config')
const { getDelinkedBatchWithRelations } = require('./batch-record-selector')
const { DELINKED } = require('./types')

const processDelinkedBatch = async (limit = 10) => {
  console.log(`[${new Date().toISOString()}] Starting delinkedCalculation batch process...`)
  const batch = await getDelinkedBatchWithRelations(limit)
  if (!batch.length) {
    console.log(`[${new Date().toISOString()}] No delinkedCalculation records to process.`)
    return 0
  }

  let processed = 0
  for (const { delinked, organisation, d365 } of batch) {
    console.log(`[${new Date().toISOString()}] Processing delinkedCalculation ${delinked.calculationReference} (SBI: ${delinked.sbi})`)
    try {
      const payload = { ...delinked, organisation, d365 }
      await sendMessage(payload, DELINKED)
      await require('../data').delinkedCalculation.update(
        { updated: new Date() },
        { where: { calculationId: delinked.calculationReference } }
      )
      processed++
      console.log(`[${new Date().toISOString()}] Processed delinkedCalculation ${delinked.calculationReference}`)
    } catch (err) {
      console.error(`[${new Date().toISOString()}] Error processing delinkedCalculation ${delinked.calculationReference}:`, err)
    }
  }
  console.log(`[${new Date().toISOString()}] Finished processing ${processed} delinkedCalculation records.`)
  return processed
}

const processBatch = async (records, type, updatePublished) => {
  let processed = 0
  for (const record of records) {
    const sanitizedUpdate = removeDefunctValues(record)
    sanitizedUpdate.type = type
    const isValid = validateUpdate(sanitizedUpdate, type)
    if (!isValid) {
      console.log(`[${new Date().toISOString()}] Skipped invalid record for ${type}`)
      continue
    }
    try {
      await sendMessage(sanitizedUpdate, type)
      const primaryKey = getPrimaryKeyValue(record, type)
      await updatePublished(primaryKey)
      processed++
      console.log(`[${new Date().toISOString()}] Processed ${type} record with key ${primaryKey}`)
    } catch (err) {
      console.error(`[${new Date().toISOString()}] Error processing ${type} record:`, err)
    }
  }
  return processed
}

const sendUpdates = async (type) => {
  if (!publishingConfig.publishingEnabled) {
    console.log(`[${new Date().toISOString()}] Publishing is disabled via publishingEnabled=false flag`)
    return
  }

  console.log(`[${new Date().toISOString()}] Starting sendUpdates for type: ${type}`)

  if (type === DELINKED) {
    const processed = await processDelinkedBatch(publishingConfig.dataPublishingMaxBatchSizePerDataSource)
    console.log(`[${new Date().toISOString()}] ${processed} delinkedCalculation datasets published`)
    return
  }

  const getUnpublished = require(`./${type}/get-unpublished`)
  const updatePublished = require(`./${type}/update-published`)

  let totalPublished = 0
  let batchNumber = 1
  let hasMore = true

  while (hasMore) {
    console.log(`[${new Date().toISOString()}] Fetching batch #${batchNumber} for ${type}...`)
    const records = await getUnpublished(null, publishingConfig.dataPublishingMaxBatchSizePerDataSource)
    if (!records.length) {
      console.log(`[${new Date().toISOString()}] No more ${type} records to process.`)
      break
    }
    const processed = await processBatch(records, type, updatePublished)
    totalPublished += processed
    console.log(`[${new Date().toISOString()}] Batch #${batchNumber} processed: ${processed} records`)
    hasMore = records.length === publishingConfig.dataPublishingMaxBatchSizePerDataSource
    batchNumber++
  }

  console.log(`[${new Date().toISOString()}] ${totalPublished} ${type} datasets published`)
}

module.exports = sendUpdates
