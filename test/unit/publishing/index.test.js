const { start } = require('../../../app/publishing')
jest.mock('../../../app/publishing/send-updates')
const sendUpdates = require('../../../app/publishing/send-updates')
const { publishingConfig } = require('../../../app/config')
const { ORGANISATION, CALCULATION, TOTAL, DAX } = require('../../../app/publishing/types')

describe('start publishing', () => {
  const originalPollingInterval = publishingConfig.pollingInterval

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.spyOn(global, 'setTimeout')
  })

  afterEach(() => {
    jest.useRealTimers()
    publishingConfig.pollingInterval = originalPollingInterval
    jest.restoreAllMocks()
  })

  test('calls sendUpdates with correct types', async () => {
    sendUpdates.mockResolvedValueOnce()

    await start()
    expect(sendUpdates).toHaveBeenCalledWith(ORGANISATION)
    expect(sendUpdates).toHaveBeenCalledWith(CALCULATION)
    expect(sendUpdates).toHaveBeenCalledWith(TOTAL)
    expect(sendUpdates).toHaveBeenCalledWith(DAX)
  })

  test('logs success message when all updates are sent', async () => {
    console.log = jest.fn()
    sendUpdates.mockResolvedValueOnce()

    await start()
    expect(console.log).toHaveBeenCalledWith('Ready to publish data')
    expect(console.log).toHaveBeenCalledWith('All outstanding valid datasets published')
  })

  test('handles errors and logs them', async () => {
    console.error = jest.fn()
    const error = new Error('Test error')
    sendUpdates.mockRejectedValueOnce(error)

    await start()
    expect(console.error).toHaveBeenCalledWith(error)
  })

  test('restarts after polling interval', async () => {
    sendUpdates.mockResolvedValueOnce()

    await start()
    jest.advanceTimersByTime(publishingConfig.pollingInterval)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), publishingConfig.pollingInterval)
  })

  test('updates timeout interval when publishingConfig.pollingInterval changes', async () => {
    const newPollingInterval = 10000

    sendUpdates.mockResolvedValueOnce()

    publishingConfig.pollingInterval = newPollingInterval

    await start()
    jest.advanceTimersByTime(newPollingInterval)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), newPollingInterval)
  })
})
