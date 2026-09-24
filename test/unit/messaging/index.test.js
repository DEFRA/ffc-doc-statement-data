jest.mock('../../../app/messaging/service-bus', () => ({
  createServiceBusClient: jest.fn(),
  createReceiver: jest.fn(),
  subscribeReceiver: jest.fn(),
  closeSenders: jest.fn()
}))

jest.mock('../../../app/messaging/demographics/process-demographics-message')

const config = require('../../../app/config')
const { createServiceBusClient, createReceiver, subscribeReceiver, closeSenders } = require('../../../app/messaging/service-bus')
const { start, stop } = require('../../../app/messaging')

let mockSbClient
let mockUpdateReceiver
let mockRetentionReceiver

beforeEach(async () => {
  config.demographicsActive = true
  jest.resetAllMocks()

  mockSbClient = { close: jest.fn() }
  mockUpdateReceiver = { close: jest.fn() }
  mockRetentionReceiver = { close: jest.fn() }

  createServiceBusClient.mockReturnValue(mockSbClient)
  createReceiver.mockImplementation((sbClient, subscriptionConfig) => {
    return subscriptionConfig === config.updatesSubscription ? mockUpdateReceiver : mockRetentionReceiver
  })
})

describe('messaging start', () => {
  test('creates service bus client', async () => {
    await start()
    expect(createServiceBusClient).toHaveBeenCalledWith(config.messageQueue)
  })

  test('creates two message receivers when demographicsActive is true', async () => {
    await start()
    expect(createReceiver).toHaveBeenCalledTimes(2)
  })

  test('subscribes to message receivers when demographicsActive is true', async () => {
    await start()
    expect(subscribeReceiver).toHaveBeenCalledTimes(2)
  })

  test('does not create demographics receiver when demographicsActive is false, subscribes to retention only', async () => {
    config.demographicsActive = false
    await start()
    expect(createReceiver).toHaveBeenCalledTimes(1)
    expect(subscribeReceiver).toHaveBeenCalledTimes(1)
  })

  test('logs message when demographicsActive is false', async () => {
    console.info = jest.fn()
    config.demographicsActive = false
    await start()
    expect(console.info).toHaveBeenCalledWith('Demographics updates not live in this environment')
  })
})

describe('messaging stop', () => {
  test('closes senders, both receivers and client if they exist', async () => {
    await start()
    await stop()
    expect(closeSenders).toHaveBeenCalled()
    expect(mockUpdateReceiver.close).toHaveBeenCalled()
    expect(mockRetentionReceiver.close).toHaveBeenCalled()
    expect(mockSbClient.close).toHaveBeenCalled()
  })
})
