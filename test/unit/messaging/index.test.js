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
  test('creates two message receivers when demographicsActive is true', async () => {
    await start()
    expect(MockMessageReceiver).toHaveBeenCalledTimes(2)
  })

  test('subscribes to message receivers twice when demographicsActive is true', async () => {
    await start()
    expect(mockSubscribe).toHaveBeenCalledTimes(2)
  })

  test('does not create new message receiver when demographicsActive is false, subscribes to retention only', async () => {
    config.demographicsActive = false
    await start()
    expect(MockMessageReceiver).toHaveBeenCalledTimes(1)
  })

  test('logs message when demographicsActive is false', async () => {
    console.info = jest.fn()
    config.demographicsActive = false
    await start()
    expect(console.info).toHaveBeenCalledWith('Demographics updates not live in this environment')
  })
})

describe('messaging stop', () => {
  test('closes both connections if receiver exists', async () => {
    await start()
    await stop()
    expect(mockCloseConnection).toHaveBeenCalledTimes(2)
  })
})
