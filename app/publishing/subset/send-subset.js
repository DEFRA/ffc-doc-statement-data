const removeDefunctValues = require('../remove-defunct-values')
const validateUpdate = require('../validate-update')
const sendMessage = require('../send-message')
const getPrimaryKeyValue = require('../get-primary-key-value')
const updatePublishedOrganisation = require('../organisation/update-published')
const updatePublishedDelinkedCalculation = require('../delinkedCalculation/update-published')
const updatePublishedD365 = require('../d365/update-published')
const { ORGANISATION, DELINKED_CALCULATION, D365 } = require('../../constants/types')

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
        switch (sanitizedUpdate.type) {
          case ORGANISATION:
            await updatePublishedOrganisation(primaryKey)
            break
          case DELINKED_CALCULATION:
            await updatePublishedDelinkedCalculation(primaryKey)
            break
          case D365:
            await updatePublishedD365(primaryKey)
            break
          default:
            throw new Error(`Unknown type: ${sanitizedUpdate.type}`)
        }
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
