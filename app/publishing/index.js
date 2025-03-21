const { publishingConfig } = require('../config')
const sendUpdates = require('./send-updates')
const { ORGANISATION, DELINKED, CALCULATION, TOTAL, DAX, D365 } = require('./types')

const updateTypes = [ORGANISATION, DELINKED, CALCULATION, TOTAL, DAX, D365]

const processUpdates = async () => {
  for (const type of updateTypes) {
    try {
      await sendUpdates(type)
    } catch (err) {
      console.error(`Error processing updates for ${type}:`, err)
    }
  }
}

const start = async () => {
  try {
    console.log('Ready to publish data')

    await processUpdates()

    console.log('All outstanding valid datasets published')
  } catch (err) {
    console.error('Error during publishing:', err)
  } finally {
    setTimeout(() => start(), publishingConfig.pollingInterval)
  }
}

module.exports = { start }
