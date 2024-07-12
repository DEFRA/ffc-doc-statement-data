const Joi = require('joi')

const schema = Joi.object({
  dataPublishingMaxBatchSizePerDataSource: Joi.number().default(250),
  pollingInterval: Joi.number().integer().default(600000)
})

const config = {
  dataPublishingMaxBatchSizePerDataSource: process.env.DATA_PUBLISHING_MAX_BATCH_SIZE_PER_DATA_SOURCE,
  pollingInterval: process.env.POLLING_INTERVAL
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The publishing config is invalid. ${result.error.message}`)
}

module.exports = result.value
