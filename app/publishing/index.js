const { publishingConfig } = require('../config')
const sendUpdates = require('./send-updates')
const { ORGANISATION, CALCULATION, TOTAL, DAX } = require('./types')

const start = async () => {
  try {
    console.log('Ready to publish data')
    await Promise.all([
      sendUpdates(ORGANISATION),
      sendUpdates(CALCULATION),
      sendUpdates(TOTAL),
      sendUpdates(DAX)
    ])
    console.log('All outstanding valid datasets published')
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, publishingConfig.pollingInterval)
  }
}

module.exports = { start }
