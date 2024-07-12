const { MessageReceiver } = require('ffc-messaging')
const config = require('../config')
const processDemographicsMessage = require('./process-demographics-message')
let updateReceiver

const start = async () => {
  const updateAction = message => processDemographicsMessage(message, updateReceiver)
  updateReceiver = new MessageReceiver(config.updatesSubscription, updateAction)
  await updateReceiver.subscribe()
  console.info('Receiver ready to receive demographics updates')
}

const stop = async () => {
  await updateReceiver.closeConnection()
}

module.exports = { start, stop }
