const { EventPublisher } = require('ffc-pay-event-publisher')
const { SOURCE } = require('../constants/source')
const { ETL_PROCESS_ERROR } = require('../constants/alerts')
const messageConfig = require('../config/message')

const createAlerts = async (errors, type = ETL_PROCESS_ERROR) => {
  if (errors?.length) {
    const alerts = errors.map(error => createAlert(error, type))
    const eventPublisher = new EventPublisher(messageConfig.alertTopic)
    await eventPublisher.publishEvents(alerts)
  }
}

const createAlert = (error, type) => {
  const data = { ...error }
  if (!data.message) {
    data.message = data
  }
  return {
    source: SOURCE,
    type,
    data
  }
}

module.exports = {
  createAlerts,
  createAlert
}
