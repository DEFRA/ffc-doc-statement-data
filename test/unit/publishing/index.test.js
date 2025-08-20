const pathBase = '../../../app'

jest.mock('../../../app/publishing/send-updates', () => jest.fn())
jest.mock('../../../app/etl', () => ({
  renameExtracts: jest.fn(),
  stageExtracts: jest.fn()
}))
jest.mock('../../../app/publishing/subset/update-subset-check', () => jest.fn())
jest.mock('../../../app/publishing/send-zero-value-alerts', () => jest.fn())
jest.mock('../../../app/messaging/create-alerts', () => jest.fn())

const { DELINKED, SFI23 } = require(pathBase + '/constants/schemes')
const { DATA_PUBLISHING_ERROR } = require(pathBase + '/constants/alerts')

describe('start publishing', () => {
  let start
  let sendUpdates
  let renameExtracts
  let stageExtracts
  let updateSubsetCheck
  let sendZeroValueAlerts
  let createAlerts
  let publishingConfig

  beforeEach(() => {
    jest.resetModules()

    sendUpdates = require(pathBase + '/publishing/send-updates')
    const etl = require(pathBase + '/etl')
    renameExtracts = etl.renameExtracts
    stageExtracts = etl.stageExtracts
    updateSubsetCheck = require(pathBase + '/publishing/subset/update-subset-check')
    sendZeroValueAlerts = require(pathBase + '/publishing/send-zero-value-alerts')
    createAlerts = require(pathBase + '/messaging/create-alerts')
    publishingConfig = require(pathBase + '/config').publishingConfig;

    ({ start } = require(pathBase + '/publishing'))

    jest.clearAllMocks()
    jest.useFakeTimers()
    jest.spyOn(global, 'setTimeout')
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  test('calls subset reset, setup functions and sendUpdates with correct types', async () => {
    sendUpdates.mockResolvedValue()
    renameExtracts.mockResolvedValue()
    stageExtracts.mockResolvedValue()
    updateSubsetCheck.mockResolvedValue()
    sendZeroValueAlerts.mockResolvedValue()
    createAlerts.mockResolvedValue()

    await start()

    expect(updateSubsetCheck).toHaveBeenCalledWith(DELINKED, false)
    expect(updateSubsetCheck).toHaveBeenCalledWith(SFI23, false)
    expect(renameExtracts).toHaveBeenCalled()
    expect(stageExtracts).toHaveBeenCalled()
    expect(sendZeroValueAlerts).toHaveBeenCalled()
    expect(sendUpdates).toHaveBeenCalledWith(DELINKED)
    expect(sendUpdates).toHaveBeenCalledWith(SFI23)
  })

  test('logs success messages when all updates are sent and shows subset reset log', async () => {
    console.log = jest.fn()
    sendUpdates.mockResolvedValue()
    renameExtracts.mockResolvedValue()
    stageExtracts.mockResolvedValue()
    updateSubsetCheck.mockResolvedValue()
    sendZeroValueAlerts.mockResolvedValue()
    createAlerts.mockResolvedValue()

    await start()

    expect(console.log).toHaveBeenCalledWith('Ready to publish data')
    expect(console.log).toHaveBeenCalledWith('Resetting subset database to send a new subset, if required')
    expect(console.log).toHaveBeenCalledWith('All outstanding valid datasets published')
  })

  test('creates an alert when sendUpdates throws for a scheme', async () => {
    const error = new Error('sendUpdates failed for test')
    // make first call fail (DELINKED), second call would still be attempted
    sendUpdates.mockRejectedValueOnce(error).mockResolvedValueOnce()
    renameExtracts.mockResolvedValue()
    stageExtracts.mockResolvedValue()
    updateSubsetCheck.mockResolvedValue()
    sendZeroValueAlerts.mockResolvedValue()
    createAlerts.mockResolvedValue()

    console.error = jest.fn()

    await start()

    expect(createAlerts).toHaveBeenCalled()
    const [alertsArray, alertType] = createAlerts.mock.calls[0]
    expect(alertType).toBe(DATA_PUBLISHING_ERROR)
    expect(Array.isArray(alertsArray)).toBe(true)
    expect(alertsArray[0]).toEqual(expect.objectContaining({
      message: error.message,
      scheme: DELINKED,
      timestamp: expect.any(String),
      stack: error.stack
    }))
    expect(isNaN(Date.parse(alertsArray[0].timestamp))).toBe(false)
  })

  test('creates an alert when top-level publishing throws and logs error', async () => {
    const testError = new Error('Top level failure')
    renameExtracts.mockRejectedValueOnce(testError)
    stageExtracts.mockResolvedValue()
    updateSubsetCheck.mockResolvedValue()
    sendZeroValueAlerts.mockResolvedValue()
    createAlerts.mockResolvedValue()

    console.error = jest.fn()

    await start()

    expect(console.error).toHaveBeenCalledWith('Error during publishing:', testError)
    expect(createAlerts).toHaveBeenCalled()
    const [alertsArray, alertType] = createAlerts.mock.calls[0]
    expect(alertType).toBe(DATA_PUBLISHING_ERROR)
    expect(Array.isArray(alertsArray)).toBe(true)
    expect(alertsArray[0]).toEqual(expect.objectContaining({
      message: testError.message,
      schemes: [DELINKED, SFI23],
      timestamp: expect.any(String),
      stack: testError.stack
    }))
    expect(isNaN(Date.parse(alertsArray[0].timestamp))).toBe(false)
  })

  test('creates fallback alert message and undefined stack when sendUpdates rejects with non-Error', async () => {
    sendUpdates.mockRejectedValueOnce({ not: 'an error' }).mockResolvedValueOnce()
    renameExtracts.mockResolvedValue()
    stageExtracts.mockResolvedValue()
    updateSubsetCheck.mockResolvedValue()
    sendZeroValueAlerts.mockResolvedValue()
    createAlerts.mockResolvedValue()

    await start()

    expect(createAlerts).toHaveBeenCalled()
    const [alertsArray, alertType] = createAlerts.mock.calls[0]
    expect(alertType).toBe(DATA_PUBLISHING_ERROR)
    expect(alertsArray[0]).toEqual(expect.objectContaining({
      message: 'Error in processUpdates',
      scheme: DELINKED,
      timestamp: expect.any(String)
    }))
    expect(alertsArray[0].stack).toBeUndefined()
  })

  test('creates fallback alert message and undefined stack when top-level rejects with non-Error', async () => {
    renameExtracts.mockRejectedValueOnce({ not: 'an error' })
    stageExtracts.mockResolvedValue()
    updateSubsetCheck.mockResolvedValue()
    sendZeroValueAlerts.mockResolvedValue()
    createAlerts.mockResolvedValue()

    await start()

    expect(createAlerts).toHaveBeenCalled()
    const [alertsArray, alertType] = createAlerts.mock.calls[0]
    expect(alertType).toBe(DATA_PUBLISHING_ERROR)
    expect(alertsArray[0]).toEqual(expect.objectContaining({
      message: 'Error in publishing loop',
      schemes: [DELINKED, SFI23],
      timestamp: expect.any(String)
    }))
    expect(alertsArray[0].stack).toBeUndefined()
  })

  test('restarts after polling interval', async () => {
    sendUpdates.mockResolvedValue()
    renameExtracts.mockResolvedValue()
    stageExtracts.mockResolvedValue()
    updateSubsetCheck.mockResolvedValue()
    sendZeroValueAlerts.mockResolvedValue()
    createAlerts.mockResolvedValue()

    await start()
    jest.advanceTimersByTime(publishingConfig.pollingInterval)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), publishingConfig.pollingInterval)
  })

  test('updates timeout interval when publishingConfig.pollingInterval changes', async () => {
    const newPollingInterval = 10000
    sendUpdates.mockResolvedValue()
    renameExtracts.mockResolvedValue()
    stageExtracts.mockResolvedValue()
    updateSubsetCheck.mockResolvedValue()
    sendZeroValueAlerts.mockResolvedValue()
    createAlerts.mockResolvedValue()

    publishingConfig.pollingInterval = newPollingInterval

    await start()
    jest.advanceTimersByTime(newPollingInterval)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), newPollingInterval)
  })
})
