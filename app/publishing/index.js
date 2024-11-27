const { publishingConfig } = require('../config')
const { renameExtracts, stageDelinkedExtracts, stageSfi23Extracts } = require('../etl')
const sendUpdates = require('./send-updates')
const { ORGANISATION, DELINKED, CALCULATION, TOTAL, DAX, D365 } = require('./types')

const start = async () => {
  try {
    console.log('Ready to publish data')
    await renameExtracts()
    await stageDelinkedExtracts()
    await stageSfi23Extracts()
    await sendUpdates(ORGANISATION)
    await sendUpdates(DELINKED)
    await sendUpdates(CALCULATION)
    await sendUpdates(TOTAL)
    await sendUpdates(DAX)
    await sendUpdates(D365)
    console.log('All outstanding valid datasets published')
  } catch (err) {
    console.error(err)
  } finally {
    setTimeout(start, publishingConfig.pollingInterval)
  }
}

module.exports = { start }
