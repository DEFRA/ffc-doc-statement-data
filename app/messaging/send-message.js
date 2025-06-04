const { MessageSender } = require('ffc-messaging')
const createMessage = require('./create-message')

const sendMessage = async (body, type, source, config, options) => {
  const message = createMessage(body, type, source, options)
  const sender = new MessageSender(config)
  await sender.sendMessage(message)
  await sender.closeConnection()
}

module.exports = sendMessage
