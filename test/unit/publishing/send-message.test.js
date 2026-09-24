const config = require('../../../app/config')
const createMessage = require('../../../app/publishing/create-message')

jest.mock('../../../app/messaging/service-bus', () => ({
  getSender: jest.fn(),
  sendMessage: jest.fn()
}))

jest.mock('../../../app/config', () => ({
  dataTopic: {
    host: 'test-host',
    address: 'test-topic'
  }
}))

jest.mock('../../../app/publishing/create-message', () =>
  jest.fn((body, type) => ({ body, type }))
)

const { getSender, sendMessage: sendServiceBusMessage } = require('../../../app/messaging/service-bus')
const sendMessage = require('../../../app/publishing/send-message')
const { closeConnection } = sendMessage

describe('send-message.js', () => {
  let consoleLogSpy
  let mockSender

  beforeEach(async () => {
    jest.clearAllMocks()
    mockSender = {
      close: jest.fn().mockResolvedValue()
    }
    getSender.mockReturnValue(mockSender)
    sendServiceBusMessage.mockResolvedValue()
    await closeConnection()
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
    expect(getSender).toHaveBeenCalledWith(config.dataTopic)
    expect(sendServiceBusMessage).toHaveBeenCalledWith(mockSender, { body, type })

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

  test('closeConnection calls sender.close and resets sender', async () => {
    await sendMessage({ sbi: 123, frn: 456 }, 'total')
    await closeConnection()
    expect(mockSender.close).toHaveBeenCalled()

    await sendMessage({ sbi: 789, frn: 321 }, 'total')
    expect(getSender).toHaveBeenCalledTimes(2)
  })
})
