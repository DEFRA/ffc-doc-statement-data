const { EventPublisher } = require('ffc-pay-event-publisher')
const { SOURCE } = require('../constants/source')
const { ETL_PROCESS_ERROR } = require('../constants/alerts')
const messageConfig = require('../config/message')

const createAlerts = async (errors) => {
  if (errors?.length) {
    const alerts = errors.map(createAlert)
    const eventPublisher = new EventPublisher(messageConfig.alertTopic)
    await eventPublisher.publishEvents(alerts)
  }
}

const createAlert = (error) => {
  return {
    source: SOURCE,
    type: ETL_PROCESS_ERROR,
    data: {
      ...error
    }
  }
}

module.exports = {
  createAlerts
}
