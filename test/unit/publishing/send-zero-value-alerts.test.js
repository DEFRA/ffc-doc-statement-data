const mockDataProcessingAlert = jest.fn()
const mockFindAndCountAllDax = jest.fn()
const mockFindAndCountAllD365 = jest.fn()
const mockUpdateDax = jest.fn()
const mockUpdateD365 = jest.fn()

jest.mock('../../../app/messaging/processing-alerts', () => ({
  dataProcessingAlert: mockDataProcessingAlert
}))

jest.mock('../../../app/data', () => ({
  zeroValueDax: {
    findAndCountAll: mockFindAndCountAllDax,
    update: mockUpdateDax
  },
  zeroValueD365: {
    findAndCountAll: mockFindAndCountAllD365,
    update: mockUpdateD365
  }
}))

const { ZERO_VALUE_STATEMENT } = require('../../../app/constants/alerts')
const sendZeroValueAlerts = require('../../../app/publishing/send-zero-value-alerts')

describe('sendZeroValueAlerts', () => {
  let logSpy
  let errorSpy

  beforeEach(() => {
    jest.clearAllMocks()
    mockDataProcessingAlert.mockReset()
    mockFindAndCountAllDax.mockReset()
    mockFindAndCountAllD365.mockReset()
    mockUpdateDax.mockReset()
    mockUpdateD365.mockReset()
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
    errorSpy.mockRestore()
  })

  test('processes and sends alerts for unsent DAX records in single batch', async () => {
    const daxRecords = [
      { id: 1, paymentReference: 'REF1', paymentAmount: 0 },
      { id: 2, paymentReference: 'REF2', paymentAmount: 0 }
    ]
    mockFindAndCountAllDax.mockResolvedValueOnce({ rows: daxRecords, count: 2 })
    mockFindAndCountAllDax.mockResolvedValueOnce({ rows: [], count: 2 })
    mockFindAndCountAllD365.mockResolvedValueOnce({ rows: [], count: 0 })

    await sendZeroValueAlerts()

    expect(mockFindAndCountAllDax).toHaveBeenCalledWith({ where: { alertSent: false }, limit: 500, offset: 0 })
    expect(mockDataProcessingAlert).toHaveBeenCalledTimes(2)
    expect(mockDataProcessingAlert).toHaveBeenCalledWith(
      {
        process: 'sendZeroValueAlerts - DAX',
        paymentReference: 'REF1',
        paymentAmount: 0,
        error: new Error('Zero value DAX record found for paymentReference: REF1')
      },
      ZERO_VALUE_STATEMENT,
      { throwOnPublishError: true }
    )
    expect(mockDataProcessingAlert).toHaveBeenCalledWith(
      {
        process: 'sendZeroValueAlerts - DAX',
        paymentReference: 'REF2',
        paymentAmount: 0,
        error: new Error('Zero value DAX record found for paymentReference: REF2')
      },
      ZERO_VALUE_STATEMENT,
      { throwOnPublishError: true }
    )
    expect(mockUpdateDax).toHaveBeenCalledWith({ alertSent: true }, { where: { id: 1 } })
    expect(mockUpdateDax).toHaveBeenCalledWith({ alertSent: true }, { where: { id: 2 } })
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Found 2 unsent zeroValueDax zero value records. Sending alerts...')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Processed batch of 2 zeroValueDax records.')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] No unsent zeroValueD365 zero value records found.')
  })

  test('logs when no unsent DAX records', async () => {
    mockFindAndCountAllDax.mockResolvedValueOnce({ rows: [], count: 0 })
    mockFindAndCountAllD365.mockResolvedValueOnce({ rows: [], count: 0 })

    await sendZeroValueAlerts()

    expect(mockFindAndCountAllDax).toHaveBeenCalledWith({ where: { alertSent: false }, limit: 500, offset: 0 })
    expect(mockDataProcessingAlert).not.toHaveBeenCalled()
    expect(mockUpdateDax).not.toHaveBeenCalled()
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] No unsent zeroValueDax zero value records found.')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] No unsent zeroValueD365 zero value records found.')
  })

  test('processes and sends alerts for unsent D365 records', async () => {
    mockFindAndCountAllDax.mockResolvedValueOnce({ rows: [], count: 0 })
    const d365Records = [{ id: 3, paymentReference: 'REF3', paymentAmount: 0 }]
    mockFindAndCountAllD365.mockResolvedValueOnce({ rows: d365Records, count: 1 })
    mockFindAndCountAllD365.mockResolvedValueOnce({ rows: [], count: 1 })

    await sendZeroValueAlerts()

    expect(mockFindAndCountAllD365).toHaveBeenCalledWith({ where: { alertSent: false }, limit: 500, offset: 0 })
    expect(mockDataProcessingAlert).toHaveBeenCalledWith(
      {
        process: 'sendZeroValueAlerts - D365',
        paymentReference: 'REF3',
        paymentAmount: 0,
        error: new Error('Zero value D365 record found for paymentReference: REF3')
      },
      ZERO_VALUE_STATEMENT,
      { throwOnPublishError: true }
    )
    expect(mockUpdateD365).toHaveBeenCalledWith({ alertSent: true }, { where: { id: 3 } })
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] No unsent zeroValueDax zero value records found.')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Found 1 unsent zeroValueD365 zero value records. Sending alerts...')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Processed batch of 1 zeroValueD365 records.')
  })

  test('handles multiple batches for DAX', async () => {
    const batch1 = Array(500).fill().map((_, i) => ({ id: i + 1, paymentReference: `REF${i + 1}`, paymentAmount: 0 }))
    const batch2 = Array(500).fill().map((_, i) => ({ id: i + 501, paymentReference: `REF${i + 501}`, paymentAmount: 0 }))
    mockFindAndCountAllDax.mockResolvedValueOnce({ rows: batch1, count: 1000 })
    mockFindAndCountAllDax.mockResolvedValueOnce({ rows: batch2, count: 1000 })
    mockFindAndCountAllDax.mockResolvedValueOnce({ rows: [], count: 1000 })
    mockFindAndCountAllD365.mockResolvedValueOnce({ rows: [], count: 0 })

    await sendZeroValueAlerts()

    expect(mockFindAndCountAllDax).toHaveBeenCalledTimes(2)
    expect(mockDataProcessingAlert).toHaveBeenCalledTimes(1000)
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Processed batch of 500 zeroValueDax records.')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Processed batch of 500 zeroValueDax records.')
  })

  test('handles error in processing alert and skips update', async () => {
    const daxRecords = [{ id: 1, paymentReference: 'REF1', paymentAmount: 0 }]
    mockFindAndCountAllDax.mockResolvedValueOnce({ rows: daxRecords, count: 1 })
    mockFindAndCountAllDax.mockResolvedValueOnce({ rows: [], count: 1 })
    mockFindAndCountAllD365.mockResolvedValueOnce({ rows: [], count: 0 })
    mockDataProcessingAlert.mockRejectedValueOnce(new Error('Publish failed'))

    await sendZeroValueAlerts()

    expect(mockDataProcessingAlert).toHaveBeenCalledTimes(1)
    expect(mockUpdateDax).not.toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalledWith('Failed to send alert for zeroValueDax record 1, skipping update', expect.any(Error))
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Processed batch of 1 zeroValueDax records.')
  })

  test('processes both DAX and D365 records', async () => {
    const daxRecords = [{ id: 1, paymentReference: 'REF1', paymentAmount: 0 }]
    const d365Records = [{ id: 2, paymentReference: 'REF2', paymentAmount: 0 }]
    mockFindAndCountAllDax.mockResolvedValueOnce({ rows: daxRecords, count: 1 })
    mockFindAndCountAllDax.mockResolvedValueOnce({ rows: [], count: 1 })
    mockFindAndCountAllD365.mockResolvedValueOnce({ rows: d365Records, count: 1 })
    mockFindAndCountAllD365.mockResolvedValueOnce({ rows: [], count: 1 })

    await sendZeroValueAlerts()

    expect(mockDataProcessingAlert).toHaveBeenCalledTimes(2)
    expect(mockUpdateDax).toHaveBeenCalledWith({ alertSent: true }, { where: { id: 1 } })
    expect(mockUpdateD365).toHaveBeenCalledWith({ alertSent: true }, { where: { id: 2 } })
  })
})
