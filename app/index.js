require('./insights').setup()
require('log-timestamp')
const { EventPublisher } = require('ffc-pay-event-publisher')
const { ETL_PROCESS_ERROR } = require('./constants/alerts')
const { SOURCE } = require('./constants/source')
const messageConfig = require('./config/message')
const publishing = require('./publishing')
const messaging = require('./messaging')

try {
  const alerting = require('ffc-alerting-utils')

  if (alerting.init) {
    alerting.init({
      topic: messageConfig.alertTopic,
      source: SOURCE,
      defaultType: ETL_PROCESS_ERROR,
      EventPublisherClass: EventPublisher
    })
  } else {
    process.env.ALERT_TOPIC = JSON.stringify(messageConfig.alertTopic)
    process.env.ALERT_SOURCE = SOURCE
    process.env.ALERT_TYPE = ETL_PROCESS_ERROR
  }
} catch (err) {
  console.warn('Failed to initialize alerting utils:', err.message)
}

process.on(['SIGTERM', 'SIGINT'], async () => {
  await messaging.stop()
  process.exit(0)
})

module.exports = (async () => {
  messaging.start()
  publishing.start()
})()
