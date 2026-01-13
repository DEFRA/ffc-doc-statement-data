jest.mock('../../../app/publishing/send-updates')
jest.mock('../../../app/publishing/window-helpers', () => ({ isWithinWindow: jest.fn(), isPollDay: jest.fn() }))
jest.mock('../../../app/etl', () => ({ prepareDWHExtracts: jest.fn(), stageDWHExtracts: jest.fn() }))
jest.mock('../../../app/publishing/send-zero-value-alerts', () => jest.fn())
jest.mock('../../../app/publishing/subset/update-subset-check', () => jest.fn())

const sendUpdates = require('../../../app/publishing/send-updates')
const { isWithinWindow, isPollDay } = require('../../../app/publishing/window-helpers')
const { prepareDWHExtracts, stageDWHExtracts } = require('../../../app/etl')
const sendZeroValueAlerts = require('../../../app/publishing/send-zero-value-alerts')
const { start } = require('../../../app/publishing')
const { publishingConfig } = require('../../../app/config')
const { DELINKED, SFI23 } = require('../../../app/constants/schemes')

describe('start publishing', () => {
  const originalPollingInterval = publishingConfig.pollingInterval

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.spyOn(global, 'setTimeout')
    isWithinWindow.mockReturnValue(true)
    isPollDay.mockReturnValue(true)
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

  test('skips publish when outside window', async () => {
    isWithinWindow.mockReturnValue(false)
    isPollDay.mockReturnValue(true)
    console.log = jest.fn()

    await start()

    expect(prepareDWHExtracts).not.toHaveBeenCalled()
    expect(stageDWHExtracts).not.toHaveBeenCalled()
    expect(sendUpdates).not.toHaveBeenCalled()
    expect(sendZeroValueAlerts).not.toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledWith('Outside publishing window or not a publishing day, skipping publish')
  })

  test('skips publish when not on poll day', async () => {
    isWithinWindow.mockReturnValue(true)
    isPollDay.mockReturnValue(false)
    console.log = jest.fn()

    await start()

    expect(prepareDWHExtracts).not.toHaveBeenCalled()
    expect(stageDWHExtracts).not.toHaveBeenCalled()
    expect(sendUpdates).not.toHaveBeenCalled()
    expect(sendZeroValueAlerts).not.toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledWith('Outside publishing window or not a publishing day, skipping publish')
  })

  test('performs full publish when in window and on day', async () => {
    isWithinWindow.mockReturnValue(true)
    isPollDay.mockReturnValue(true)
    sendUpdates.mockResolvedValue()
    prepareDWHExtracts.mockResolvedValue()
    stageDWHExtracts.mockResolvedValue()
    sendZeroValueAlerts.mockResolvedValue()
    console.log = jest.fn()

    await start()

    expect(prepareDWHExtracts).toHaveBeenCalled()
    expect(stageDWHExtracts).toHaveBeenCalled()
    expect(sendUpdates).toHaveBeenCalledWith(DELINKED)
    expect(sendUpdates).toHaveBeenCalledWith(SFI23)
    expect(sendZeroValueAlerts).toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledWith('All outstanding valid datasets published')
  })
})
