jest.mock('../../app/insights', () => ({
  setup: jest.fn()
}))
jest.mock('log-timestamp', () => jest.fn())
jest.mock('../../app/publishing', () => ({
  start: jest.fn()
}))
jest.mock('../../app/messaging', () => ({
  start: jest.fn(),
  stop: jest.fn()
}))

const { setup: mockSetup } = require('../../app/insights')
const { start: mockPublishingStart } = require('../../app/publishing')
const { start: mockMessagingStart } = require('../../app/messaging')

describe('app', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.isolateModules(() => {
      require('../../app')
    })
  })

  test('should setup insights', () => {
    expect(mockSetup).toHaveBeenCalled()
  })

  test('should start publishing', () => {
    expect(mockPublishingStart).toHaveBeenCalled()
  })

  test('should start messaging', () => {
    expect(mockMessagingStart).toHaveBeenCalled()
  })
})

describe('alerting initialization', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    jest.resetModules()
    jest.clearAllMocks()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  test('sets environment variables when alerting.init is not defined', () => {
    jest.mock('ffc-alerting-utils', () => ({})) // No init method

    require('../../app')

    expect(process.env.ALERT_TOPIC).toBeDefined()
    expect(process.env.ALERT_SOURCE).toBeDefined()
    expect(process.env.ALERT_TYPE).toBeDefined()
  })

  test('logs warning when alerting utils initialization fails', () => {
    jest.mock('ffc-alerting-utils', () => {
      throw new Error('Mocked failure')
    })

    console.warn = jest.fn()

    require('../../app')

    expect(console.warn).toHaveBeenCalledWith(
      'Failed to initialize alerting utils:',
      expect.stringContaining('Mocked failure')
    )
  })
})
