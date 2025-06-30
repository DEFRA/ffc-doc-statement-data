const { publishingConfig } = require('../config')
const removeDefunctValues = require('./remove-defunct-values')
const validateUpdate = require('./validate-update')
const sendMessage = require('./send-message')
const getPrimaryKeyValue = require('./get-primary-key-value')
const { CALCULATION } = require('../constants/types')

const defaultPublishingPerType = async (type) => {
  const getUnpublished = require(`./${type}/get-unpublished`)
  const updatePublished = require(`./${type}/update-published`)
  let totalPublished = 0
  const batchSize = publishingConfig.dataPublishingMaxBatchSizePerDataSource

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

    if (type === CALCULATION && outstanding.length > 0) {
      break
    }
  } while (outstanding.length === batchSize)

  console.log(`${totalPublished} ${type} datasets published`)
}

module.exports = defaultPublishingPerType
