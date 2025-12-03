const { MessageReceiver } = require('ffc-messaging')
const config = require('../config')
const processDemographicsMessage = require('./demographics/process-demographics-message')
let updateReceiver

const start = async () => {
  if (config.demographicsActive) {
    const updateAction = message => processDemographicsMessage(message, updateReceiver)
    updateReceiver = new MessageReceiver(config.updatesSubscription, updateAction)
    await updateReceiver.subscribe()
    console.info('Receiver ready to receive demographics updates')
  } else {
    console.info('Demographics updates not live in this environment')
  }
}

const stop = async () => {
  if (updateReceiver) {
    await updateReceiver.closeConnection()
  }
}

module.exports = { start, stop }
