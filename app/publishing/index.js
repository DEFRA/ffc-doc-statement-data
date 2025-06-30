const { publishingConfig } = require('../config')
const { DELINKED, SFI23 } = require('../constants/schemes')
const { renameExtracts, stageExtracts } = require('../etl')
const sendUpdates = require('./send-updates')

const schemes = [DELINKED, SFI23]

const processUpdates = async () => {
  for (const scheme of schemes) {
    try {
      await sendUpdates(scheme)
    } catch (err) {
      console.error(`Error processing updates for ${scheme}:`, err)
    }
  }
}

const start = async () => {
  try {
    console.log('Ready to publish data')
    await renameExtracts()
    await stageExtracts()
    await processUpdates()
    console.log('All outstanding valid datasets published')
  } catch (err) {
    console.error('Error during publishing:', err)
  } finally {
    setTimeout(() => start(), publishingConfig.pollingInterval)
  }
}

module.exports = { start }
