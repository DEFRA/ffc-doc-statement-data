const { start } = require('../../../app/publishing')
jest.mock('../../../app/publishing/send-updates')
const sendUpdates = require('../../../app/publishing/send-updates')
const { publishingConfig } = require('../../../app/config')
const { DELINKED, SFI23 } = require('../../../app/constants/schemes')

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
    expect(sendUpdates).toHaveBeenCalledWith(DELINKED)
    expect(sendUpdates).toHaveBeenCalledWith(SFI23)
  })

  test('logs success message when all updates are sent', async () => {
    console.log = jest.fn()
    sendUpdates.mockResolvedValueOnce()

    await start()
    expect(console.log).toHaveBeenCalledWith('Ready to publish data')
    expect(console.log).toHaveBeenCalledWith('All outstanding valid datasets published')
  })

  test('handles errors and logs them for individual types', async () => {
    console.error = jest.fn()
    const error = new Error('Test error')
    sendUpdates.mockRejectedValueOnce(error)

    await start()
    expect(console.error).toHaveBeenCalledWith(`${'Error processing updates for ' + DELINKED}:`, error)
  })

  test('handles errors during publishing and logs them', async () => {
    console.error = jest.fn()
    const testError = new Error('Test error during publishing')
    const iteratorSpy = jest.spyOn(Array.prototype, Symbol.iterator).mockImplementationOnce(function () {
      throw testError
    })

    await start()
    expect(console.error).toHaveBeenCalledWith('Error during publishing:', testError)
    iteratorSpy.mockRestore()
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
