const mockSubscribe = jest.fn()
const mockCloseConnection = jest.fn()

const MockMessageReceiver = jest.fn().mockImplementation(() => {
  return {
    subscribe: mockSubscribe,
    closeConnection: mockCloseConnection
  }
})

jest.mock('ffc-messaging', () => {
  return {
    MessageReceiver: MockMessageReceiver
  }
})

jest.mock('../../../app/messaging/process-demographics-message')

const config = require('../../../app/config')

const { start, stop } = require('../../../app/messaging')

beforeEach(() => {
  jest.clearAllMocks()

  config.enabled = true
})

describe('messaging start', () => {
  test('creates new message receiver', async () => {
    await start()
    expect(MockMessageReceiver).toHaveBeenCalledTimes(1)
  })

  test('subscribes to message receiver', async () => {
    await start()
    expect(mockSubscribe).toHaveBeenCalledTimes(1)
  })
})

describe('messaging stop', () => {
  test('closes connection', async () => {
    await stop()
    expect(mockCloseConnection).toHaveBeenCalledTimes(1)
  })
})
