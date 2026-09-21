const config = require('../config')
const { createServiceBusClient, createReceiver, subscribeReceiver, closeSenders } = require('./service-bus')
const processDemographicsMessage = require('./demographics/process-demographics-message')
const { processRetentionMessage } = require('./process-retention-message')
const errorHandler = (error) => {
  console.error('Error occurred:', error)
}

let sbClient
let updateReceiver
let retentionReceiver

const start = async () => {
  sbClient = createServiceBusClient(config.messageQueue)

  if (config.demographicsActive) {
    updateReceiver = createReceiver(sbClient, config.updatesSubscription)
    subscribeReceiver(updateReceiver, processDemographicsMessage, errorHandler, config.updatesSubscription)
    console.info('Receiver ready to receive demographics updates')
  } else {
    console.info('Demographics updates not live in this environment')
  }

  const retentionAction = message => processRetentionMessage(message, retentionReceiver)
  retentionReceiver = createReceiver(sbClient, config.retentionSubscription)
  subscribeReceiver(retentionReceiver, retentionAction, errorHandler, config.retentionSubscription)
  console.info('Retention receiver ready')
}

const stop = async () => {
  await closeSenders()

  if (updateReceiver) {
    try {
      await updateReceiver.close()
    } catch (error) {
      console.error('Error occurred while closing update receiver:', error)
    }
  }
  if (retentionReceiver) {
    try {
      await retentionReceiver.close()
    } catch (error) {
      console.error('Error occurred while closing retention receiver:', error)
    }
  }

  if (sbClient) {
    try {
      await sbClient.close()
    } catch (error) {
      console.error('Error occurred while closing Service Bus client:', error)
    }
  }
}

module.exports = { start, stop }
