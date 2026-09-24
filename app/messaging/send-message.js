const { getSender, sendMessage: sendServiceBusMessage } = require('./service-bus')
const createMessage = require('./create-message')

const sendMessage = async (body, type, source, config, options) => {
  const message = createMessage(body, type, source, options)
  const sender = getSender(config)
  await sendServiceBusMessage(sender, message)
}

module.exports = sendMessage
