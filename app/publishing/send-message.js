const { getSender, sendMessage: sendServiceBusMessage } = require('../messaging/service-bus')
const config = require('../config')
const createMessage = require('./create-message')
let sender

const getSenderSb = () => {
  if (!sender) {
    sender = getSender(config.dataTopic)
  }
  return sender
}

const sendMessage = async (body, type) => {
  const message = createMessage(body, type)
  const messageSender = getSenderSb()
  await sendServiceBusMessage(messageSender, message)

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
    await sender.close()
    sender = null
  }
}

module.exports = sendMessage
module.exports.closeConnection = closeConnection
