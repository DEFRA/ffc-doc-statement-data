const getPrimaryKeyValue = require('./get-primary-key-value')
const sendMessage = require('./send-message')
const removeDefunctValues = require('./remove-defunct-values')
const validateUpdate = require('./validate-update')
const { publishingConfig } = require('../config')

const sendUpdates = async (type) => {
  const getUnpublished = require(`./${type}/get-unpublished`)
  const updatePublished = require(`./${type}/update-published`)
  let totalPublished = 0
  const batchSize = publishingConfig.dataPublishingMaxBatchSizePerDataSource || 250

  let outstanding = []
  do {
    outstanding = await getUnpublished(null, batchSize)
    if (outstanding.length) {
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

    if (type === 'calculation' && outstanding.length > 0) {
      break
    }
  } while (outstanding.length === batchSize)

  console.log('%i %s datasets published', totalPublished, type)
}

module.exports = sendUpdates
