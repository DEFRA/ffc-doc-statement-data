const mockFindAllDax = jest.fn()
const mockUpdateDax = jest.fn()
const mockFindAllD365 = jest.fn()
const mockUpdateD365 = jest.fn()

jest.mock('../../../app/data', () => ({
  zeroValueDax: { findAll: mockFindAllDax, update: mockUpdateDax },
  zeroValueD365: { findAll: mockFindAllD365, update: mockUpdateD365 }
}))

jest.mock('../../../app/messaging/create-alerts', () => ({
  createAlerts: jest.fn()
}))

const { createAlerts } = require('../../../app/messaging/create-alerts')
const { ZERO_VALUE_STATEMENT } = require('../../../app/constants/alerts')
const sendZeroValueAlerts = require('../../../app/publishing/send-zero-value-alerts')

describe('sendZeroValueAlerts', () => {
  let logSpy

  beforeEach(() => {
    jest.clearAllMocks()
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
  })

  test('sends alerts and marks as sent for unsent DAX records', async () => {
    const daxRecords = [{ toJSON: () => ({ id: 1 }) }, { toJSON: () => ({ id: 2 }) }]
    mockFindAllDax.mockResolvedValueOnce(daxRecords)
    mockUpdateDax.mockResolvedValueOnce()
    mockFindAllD365.mockResolvedValueOnce([])

    await sendZeroValueAlerts()

    expect(mockFindAllDax).toHaveBeenCalledWith({ where: { alertSent: false } })
    expect(createAlerts).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }], ZERO_VALUE_STATEMENT)
    expect(mockUpdateDax).toHaveBeenCalledWith({ alertSent: true }, { where: { alertSent: false } })
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Found 2 unsent DAX zero value records. Sending alerts...')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Sent alerts and marked as sent for 2 DAX records.')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] No unsent D365 zero value records found.')
  })

  test('logs when no unsent DAX records', async () => {
    mockFindAllDax.mockResolvedValueOnce([])
    mockFindAllD365.mockResolvedValueOnce([])

    await sendZeroValueAlerts()

    expect(mockFindAllDax).toHaveBeenCalledWith({ where: { alertSent: false } })
    expect(createAlerts).not.toHaveBeenCalled()
    expect(mockUpdateDax).not.toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] No unsent DAX zero value records found.')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] No unsent D365 zero value records found.')
  })

  test('sends alerts and marks as sent for unsent D365 records', async () => {
    mockFindAllDax.mockResolvedValueOnce([])
    const d365Records = [{ toJSON: () => ({ id: 3 }) }]
    mockFindAllD365.mockResolvedValueOnce(d365Records)
    mockUpdateD365.mockResolvedValueOnce()

    await sendZeroValueAlerts()

    expect(mockFindAllD365).toHaveBeenCalledWith({ where: { alertSent: false } })
    expect(createAlerts).toHaveBeenCalledWith([{ id: 3 }], ZERO_VALUE_STATEMENT)
    expect(mockUpdateD365).toHaveBeenCalledWith({ alertSent: true }, { where: { alertSent: false } })
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] No unsent DAX zero value records found.')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Found 1 unsent D365 zero value records. Sending alerts...')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Sent alerts and marked as sent for 1 D365 records.')
  })

  test('logs when no unsent D365 records', async () => {
    mockFindAllDax.mockResolvedValueOnce([])
    mockFindAllD365.mockResolvedValueOnce([])

    await sendZeroValueAlerts()

    expect(mockFindAllD365).toHaveBeenCalledWith({ where: { alertSent: false } })
    expect(createAlerts).not.toHaveBeenCalled()
    expect(mockUpdateD365).not.toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] No unsent DAX zero value records found.')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] No unsent D365 zero value records found.')
  })
})
