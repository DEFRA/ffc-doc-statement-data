const removeDefunctValues = require('../remove-defunct-values')
const validateUpdate = require('../validate-update')
const sendMessage = require('../send-message')
const getPrimaryKeyValue = require('../get-primary-key-value')
const updatePublishedOrganisation = require('../organisation/update-published')

const sendSubset = async (tablesToTarget) => {
  for (const table of tablesToTarget) {
    let totalPublished = 0
    const promises = table.dataToPublish?.map(async (record) => {
      const sanitizedUpdate = removeDefunctValues(record)
      sanitizedUpdate.type = table.type
      const isValid = validateUpdate(sanitizedUpdate, sanitizedUpdate.type)
      if (isValid) {
        await sendMessage(sanitizedUpdate, sanitizedUpdate.type)
        const primaryKey = getPrimaryKeyValue(record, sanitizedUpdate.type)
        await updatePublishedOrganisation(primaryKey)
        totalPublished++
      }
    })
    if (promises) {
      await Promise.all(promises)
      console.log('%i %s datasets published', totalPublished, table.type)
    }
  }
}

module.exports = sendSubset
