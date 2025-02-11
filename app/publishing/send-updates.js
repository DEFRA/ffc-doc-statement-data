const getPrimaryKeyValue = require('./get-primary-key-value')
const sendMessage = require('./send-message')
const removeDefunctValues = require('./remove-defunct-values')
const validateUpdate = require('./validate-update')

const sendUpdates = async (type) => {
  const getUnpublished = require(`./${type}/get-unpublished`)
  const updatePublished = require(`./${type}/update-published`)
  let totalPublished = 0

  const outstanding = await getUnpublished()
  for (const unpublished of outstanding) {
    const sanitizedUpdate = removeDefunctValues(unpublished)
    sanitizedUpdate.type = type
    const isValid = validateUpdate(sanitizedUpdate, type)
    if (isValid) {
      await sendMessage(sanitizedUpdate, type)
      const primaryKey = getPrimaryKeyValue(unpublished, type)
      await updatePublished(primaryKey)
      totalPublished++
    }
  }
  console.log('%i %s datasets published', totalPublished, type)
}

module.exports = sendUpdates
