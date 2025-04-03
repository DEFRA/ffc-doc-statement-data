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

  test('sendMessage builds and sends a message and logs the output', async () => {
    const body = { test: 'data' }
    const type = 'total'

    await sendMessage(body, type)

    expect(createMessage).toHaveBeenCalledWith(body, type)
    expect(MessageSender).toHaveBeenCalledWith(config.dataTopic)

    const messageSenderInstance = MessageSender.mock.results[0].value
    const message = { body, type }
    expect(messageSenderInstance.sendMessage).toHaveBeenCalledWith(message)

    expect(consoleLogSpy).toHaveBeenCalledWith(
      `Sent ${type} data`,
      expect.any(String)
    )
  })

  test('closeConnection calls sender.closeConnection and resets sender', async () => {
    await sendMessage({ test: 'data' }, 'total')
    const messageSenderInstance = MessageSender.mock.results[0].value
    await closeConnection()
    expect(messageSenderInstance.closeConnection).toHaveBeenCalled()

    await sendMessage({ test: 'data2' }, 'total')
    expect(MessageSender.mock.results[0].value).not.toBe(MessageSender.mock.results[1].value)
  })
})
