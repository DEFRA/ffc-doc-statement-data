const config = require('../../../app/config')
const createMessage = require('../../../app/publishing/create-message')
const { MessageSender } = require('ffc-messaging')

jest.mock('ffc-messaging', () => {
  return {
    MessageSender: jest.fn().mockImplementation(() => {
      return {
        sendMessage: jest.fn().mockResolvedValue(),
        closeConnection: jest.fn().mockResolvedValue()
      }
    })
  }
})

jest.mock('../../../app/config', () => ({
  dataTopic: 'test-topic'
}))

jest.mock('../../../app/publishing/create-message', () =>
  jest.fn((body, type) => ({ body, type }))
)

const sendMessage = require('../../../app/publishing/send-message')
const { closeConnection } = sendMessage

describe('send-message.js', () => {
  let consoleLogSpy

  beforeEach(async () => {
    await closeConnection()
    MessageSender.mockClear()
    createMessage.mockClear()
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { })
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
  })

  test('sendMessage builds and sends a message and logs sbi/frn for non-d365/dax types', async () => {
    const body = { sbi: 123, frn: 456, invoiceNumber: 'INV001' }
    const type = 'total'

    await sendMessage(body, type)

    expect(createMessage).toHaveBeenCalledWith(body, type)
    expect(MessageSender).toHaveBeenCalledWith(config.dataTopic)

    const messageSenderInstance = MessageSender.mock.results[0].value
    const message = { body, type }
    expect(messageSenderInstance.sendMessage).toHaveBeenCalledWith(message)

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Sent total data — sbi: 123, frn: 456, invoiceNumber: INV001'
    )
  })

  test('sendMessage logs sbi/frn without invoiceNumber when invoiceNumber is not present', async () => {
    const body = { sbi: 789, frn: 321 }
    const type = 'delinkedCalculation'

    await sendMessage(body, type)

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Sent delinkedCalculation data — sbi: 789, frn: 321'
    )
  })

  test('sendMessage logs paymentReference for d365 type', async () => {
    const body = { paymentReference: 'PAY123456' }
    const type = 'd365'

    await sendMessage(body, type)

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Sent d365 data — paymentReference: PAY123456'
    )
  })

  test('sendMessage logs paymentReference for dax type', async () => {
    const body = { paymentReference: 'DAX789012' }
    const type = 'dax'

    await sendMessage(body, type)

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Sent dax data — paymentReference: DAX789012'
    )
  })

  test('closeConnection calls sender.closeConnection and resets sender', async () => {
    await sendMessage({ sbi: 123, frn: 456 }, 'total')
    const messageSenderInstance = MessageSender.mock.results[0].value
    await closeConnection()
    expect(messageSenderInstance.closeConnection).toHaveBeenCalled()

    await sendMessage({ sbi: 789, frn: 321 }, 'total')
    expect(MessageSender.mock.results[0].value).not.toBe(MessageSender.mock.results[1].value)
  })
})
