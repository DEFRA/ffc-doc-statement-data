const { publishingConfig } = require('../config')
const { DELINKED, SFI23 } = require('../constants/schemes')
const { renameExtracts, stageExtracts } = require('../etl')
const sendUpdates = require('./send-updates')
const updateSubsetCheck = require('./subset/update-subset-check')
const sendZeroValueAlerts = require('./send-zero-value-alerts')
const createAlerts = require('../messaging/create-alerts')
const { DATA_PUBLISHING_ERROR } = require('../constants/alerts')

const schemes = [DELINKED, SFI23]
let resetSinceRestart = false

const processUpdates = async () => {
  for (const scheme of schemes) {
    try {
      await sendUpdates(scheme)
    } catch (err) {
      console.error(`Error processing updates for ${scheme}:`, err)
      const alertPayload = {
        message: err?.message ?? 'Error in processUpdates',
        stack: err?.stack,
        scheme,
        timestamp: new Date().toISOString()
      }
      createAlerts([alertPayload], DATA_PUBLISHING_ERROR).catch(console.error)
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
    await sendZeroValueAlerts()
    console.log('All outstanding valid datasets published')
  } catch (err) {
    console.error('Error during publishing:', err)
    const alertPayload = {
      message: err?.message ?? 'Error in publishing loop',
      stack: err?.stack,
      schemes: [DELINKED, SFI23],
      timestamp: new Date().toISOString()
    }

    createAlerts([alertPayload], DATA_PUBLISHING_ERROR).catch(console.error)
  } finally {
    setTimeout(() => start(), publishingConfig.pollingInterval)
  }
}

module.exports = { start }
