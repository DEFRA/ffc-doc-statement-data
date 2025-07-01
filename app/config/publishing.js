const Joi = require('joi')

const defaultDataPublishingBatchSize = 1000
const defaultPollingInterval = 3600000
const defaultSubsetAmount = 10
const logIntervalMs = 600000

const schema = Joi.object({
  dataPublishingMaxBatchSizePerDataSource: Joi.number().default(defaultDataPublishingBatchSize),
  pollingInterval: Joi.number().integer().default(defaultPollingInterval),
  publishingEnabled: Joi.boolean().default(true),
  subsetProcessDelinked: Joi.boolean().default(false),
  delinked: Joi.object({
    subsetProcess: Joi.boolean().default(false),
    processSubsetAmount: Joi.number().integer().default(defaultSubsetAmount)
  }).required(),
  sfi23: Joi.object({
    subsetProcess: Joi.boolean().default(false),
    processSubsetAmount: Joi.number().integer().default(defaultSubsetAmount)
  }).required(),
  logIntervalMs: Joi.number().integer().default(logIntervalMs)
})

const config = {
  dataPublishingMaxBatchSizePerDataSource: process.env.DATA_PUBLISHING_MAX_BATCH_SIZE_PER_DATA_SOURCE,
  pollingInterval: process.env.POLLING_INTERVAL,
  publishingEnabled: process.env.PUBLISHING_ENABLED,
  delinked: {
    subsetProcess: process.env.SUBSET_PROCESS_DELINKED,
    processSubsetAmount: process.env.PROCESS_DELINKED_SUBSET_AMOUNT
  },
  sfi23: {
    subsetProcess: process.env.SUBSET_PROCESS_SFI23,
    processSubsetAmount: process.env.PROCESS_SFI23_SUBSET_AMOUNT
  },
  logIntervalMs: process.env.LOG_INTERVAL_MS
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The publishing config is invalid. ${result.error.message}`)
}

module.exports = result.value
