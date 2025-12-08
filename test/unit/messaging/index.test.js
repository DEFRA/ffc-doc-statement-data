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

jest.mock('../../../app/messaging/demographics/process-demographics-message')

const config = require('../../../app/config')
const { start, stop } = require('../../../app/messaging')

beforeEach(async () => {
  config.demographicsActive = true
  jest.clearAllMocks()
})

describe('messaging start', () => {
  test('creates new message receiver when demographicsActive is true', async () => {
    await start()
    expect(MockMessageReceiver).toHaveBeenCalledTimes(1)
  })

  test('subscribes to message receiver when demographicsActive is true', async () => {
    await start()
    expect(mockSubscribe).toHaveBeenCalledTimes(1)
  })

  test('does not create new message receiver when demographicsActive is false', async () => {
    config.demographicsActive = false
    await start()
    expect(MockMessageReceiver).not.toHaveBeenCalled()
  })

  test('logs message when demographicsActive is false', async () => {
    console.info = jest.fn()
    config.demographicsActive = false
    await start()
    expect(console.info).toHaveBeenCalledWith('Demographics updates not live in this environment')
  })
})

describe('messaging stop', () => {
  test('closes connection if receiver exists', async () => {
    await start()
    await stop()
    expect(mockCloseConnection).toHaveBeenCalledTimes(1)
  })
})
