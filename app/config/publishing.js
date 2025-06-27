const Joi = require('joi')

const defaultDataPublishingBatchSize = 1000
const defaultPollingInterval = 3600000
const processDelinkedSubsetAmount = 10
const logIntervalMs = 600000

const schema = Joi.object({
  dataPublishingMaxBatchSizePerDataSource: Joi.number().default(defaultDataPublishingBatchSize),
  pollingInterval: Joi.number().integer().default(defaultPollingInterval),
  publishingEnabled: Joi.boolean().default(true),
  subsetProcessDelinked: Joi.boolean().default(false),
  processDelinkedSubsetAmount: Joi.number().integer().min(1).default(processDelinkedSubsetAmount),
  logIntervalMs: Joi.number().integer().default(logIntervalMs)

})

const config = {
  dataPublishingMaxBatchSizePerDataSource: process.env.DATA_PUBLISHING_MAX_BATCH_SIZE_PER_DATA_SOURCE,
  pollingInterval: process.env.POLLING_INTERVAL,
  publishingEnabled: process.env.PUBLISHING_ENABLED,
  subsetProcessDelinked: process.env.SUBSET_PROCESS_DELINKED,
  processDelinkedSubsetAmount: process.env.PROCESS_DELINKED_SUBSET_AMOUNT,
  logIntervalMs: process.env.LOG_INTERVAL_MS
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The publishing config is invalid. ${result.error.message}`)
}

module.exports = result.value
