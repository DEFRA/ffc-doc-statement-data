const { EventPublisher } = require('ffc-pay-event-publisher')
const { SOURCE } = require('../constants/source')
const { ETL_PROCESS_ERROR } = require('../constants/alerts')
const messageConfig = require('../config/message')

const createAlerts = async (inputs, type = ETL_PROCESS_ERROR) => {
  if (!inputs?.length) {
    return
  }

  const isAlertArray = inputs.every(input =>
    typeof input === 'object' && input !== null &&
    (input.source || input.type || input.data)
  )

  let alerts
  if (isAlertArray) {
    alerts = inputs.map(alert => ({
      source: alert.source || SOURCE,
      type: alert.type || type,
      data: alert.data || alert
    }))
  } else {
    alerts = inputs.map(error => createAlert(error, type))
  }

  const eventPublisher = new EventPublisher(messageConfig.alertTopic)
  await eventPublisher.publishEvents(alerts)
}

const createAlert = (error, type) => {
  return {
    source: SOURCE,
    type,
    data: { ...error }
  }
}

module.exports = {
  createAlerts
}
