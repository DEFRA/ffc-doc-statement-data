const { MessageSender } = require('ffc-messaging')
const config = require('../config')
const createMessage = require('./create-message')
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

  let logMessage
  if (type === 'd365' || type === 'dax') {
    logMessage = `Sent ${type} data — paymentReference: ${body.paymentReference}`
  } else {
    const invoiceNumberPart = body.invoiceNumber ? `, invoiceNumber: ${body.invoiceNumber}` : ''
    logMessage = `Sent ${type} data — sbi: ${body.sbi}, frn: ${body.frn}${invoiceNumberPart}`
  }

  console.log(logMessage)
}

const closeConnection = async () => {
  if (sender) {
    await sender.closeConnection()
    sender = null
  }
}

module.exports = sendMessage
module.exports.closeConnection = closeConnection
