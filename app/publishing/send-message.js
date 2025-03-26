const config = require('../config')
const { MessageSender } = require('ffc-messaging')
const createMessage = require('./create-message')
const util = require('util')

let sender

const getSender = () => {
  if (!sender) {
    sender = new MessageSender(config.dataTopic)
  }
  return sender
}

const sendMessage = async (body, type) => {
  const message = createMessage(body, type)
  const messageSender = getSender()
  await messageSender.sendMessage(message)
  console.log(`Sent ${type} data`, util.inspect(body, false, null, true))
}

const closeConnection = async () => {
  if (sender) {
    await sender.closeConnection()
    sender = null
  }
}

module.exports = sendMessage
module.exports.closeConnection = closeConnection
