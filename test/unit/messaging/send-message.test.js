jest.mock('../../../app/messaging/service-bus', () => ({
  getSender: jest.fn(),
  sendMessage: jest.fn()
}))

jest.mock('../../../app/messaging/create-message')
const createMessage = require('../../../app/messaging/create-message')
const { getSender, sendMessage: sendServiceBusMessage } = require('../../../app/messaging/service-bus')

const sendMessage = require('../../../app/messaging/send-message')

let statement, config, options, type

describe('send message', () => {
  beforeEach(() => {
    const body = {
      content: 'hello'
    }
    type = 'uk.gov.doc.statement'
    config = {
      source: 'ffc-doc-statement-constructor'
    }
    options = {}

    getSender.mockReturnValue({ close: jest.fn() })
    sendServiceBusMessage.mockResolvedValue()
    createMessage.mockReturnValue({
      body,
      type,
      source: config.source,
      ...options
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call createMessage', async () => {
    await sendMessage(statement, type, config.source, config, options)
    expect(createMessage).toHaveBeenCalled()
  })

  test('should call createMessage once', async () => {
    await sendMessage(statement, type, config.source, config, options)
    expect(createMessage).toHaveBeenCalledTimes(1)
  })

  test('should call createMessage with statement, type, config.source and options', async () => {
    await sendMessage(statement, type, config.source, config, options)
    expect(createMessage).toHaveBeenCalledWith(statement, type, config.source, options)
  })

  test('should call getSender', async () => {
    await sendMessage(statement, type, config.source, config, options)
    expect(getSender).toHaveBeenCalledWith(config)
  })

  test('should call getSender once', async () => {
    await sendMessage(statement, type, config.source, config, options)
    expect(getSender).toHaveBeenCalledTimes(1)
  })

  test('should call sendServiceBusMessage', async () => {
    await sendMessage(statement, type, config.source, config, options)
    expect(sendServiceBusMessage).toHaveBeenCalled()
  })

  test('should call sendServiceBusMessage once', async () => {
    await sendMessage(statement, type, config.source, config, options)
    expect(sendServiceBusMessage).toHaveBeenCalledTimes(1)
  })

  test('should call sendServiceBusMessage with sender and message', async () => {
    const sender = getSender()
    const message = createMessage()
    await sendMessage(statement, type, config.source, config, options)
    expect(sendServiceBusMessage).toHaveBeenCalledWith(sender, message)
  })

  test('should throw if sendServiceBusMessage rejects', async () => {
    sendServiceBusMessage.mockRejectedValueOnce(new Error('send error'))
    await expect(sendMessage(statement, type, config.source, config, options)).rejects.toThrow('send error')
  })

  test('should propagate error if createMessage throws', async () => {
    createMessage.mockImplementationOnce(() => { throw new Error('create error') })
    await expect(sendMessage(statement, type, config.source, config, options)).rejects.toThrow('create error')
    expect(sendServiceBusMessage).not.toHaveBeenCalled()
  })
})
