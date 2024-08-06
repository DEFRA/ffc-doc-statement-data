require('./insights').setup()
require('log-timestamp')
const publishing = require('./publishing')
const messaging = require('./messaging')

process.on(['SIGTERM', 'SIGINT'], async () => {
  await messaging.stop()
  process.exit(0)
})

module.exports = (async () => {
  messaging.start()
  publishing.start()
})()
