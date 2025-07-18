const { publishingConfig } = require('../config')
const { DELINKED, SFI23 } = require('../constants/schemes')
const { renameExtracts, stageExtracts } = require('../etl')
const sendUpdates = require('./send-updates')
const updateSubsetCheck = require('./subset/update-subset-check')

const schemes = [DELINKED, SFI23]
let resetSinceRestart = false

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
    if (!resetSinceRestart) {
      console.log('Resetting subset database to send a new subset, if required')
      await updateSubsetCheck(DELINKED, false)
      await updateSubsetCheck(SFI23, false)
      resetSinceRestart = true
    }
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
