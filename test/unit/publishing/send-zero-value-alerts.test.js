const mockDataProcessingAlert = jest.fn()
const mockFindAllDax = jest.fn()
const mockFindAllD365 = jest.fn()
const mockUpdateDax = jest.fn()
const mockUpdateD365 = jest.fn()

jest.mock('ffc-alerting-utils', () => ({
  dataProcessingAlert: mockDataProcessingAlert
}))

jest.mock('../../../app/data', () => ({
  zeroValueDax: {
    findAll: mockFindAllDax,
    update: mockUpdateDax
  },
  zeroValueD365: {
    findAll: mockFindAllD365,
    update: mockUpdateD365
  },
  Sequelize: {
    Op: {
      gt: Symbol('gt')
    }
  }
}))

const { ZERO_VALUE_STATEMENT } = require('../../../app/constants/alerts')
const sendZeroValueAlerts = require('../../../app/publishing/send-zero-value-alerts')

describe('sendZeroValueAlerts', () => {
  let logSpy
  let errorSpy

  beforeEach(() => {
    jest.clearAllMocks()

    // Always return empty array by default
    mockFindAllDax.mockReset().mockResolvedValue([])
    mockFindAllD365.mockReset().mockResolvedValue([])
    mockUpdateDax.mockReset().mockResolvedValue()
    mockUpdateD365.mockReset().mockResolvedValue()
    mockDataProcessingAlert.mockReset().mockResolvedValue()

    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
    errorSpy.mockRestore()
  })

  test.each([
    ['DAX', mockFindAllDax, mockUpdateDax, 'daxId'],
    ['D365', mockFindAllD365, mockUpdateD365, 'd365Id']
  ])(
    'processes and sends alerts for unsent %s records in single batch',
    async (_, findAllMock, updateMock, idField) => {
      const records = [
        { [idField]: 1, paymentReference: 'REF1', paymentAmount: 0 },
        { [idField]: 2, paymentReference: 'REF2', paymentAmount: 0 }
      ]
      findAllMock
        .mockResolvedValueOnce(records)
        .mockResolvedValueOnce([])

      await sendZeroValueAlerts()

      // Determine log type to match actual log capitalization
      const logType = _ === 'DAX' ? 'Dax' : _

      expect(findAllMock).toHaveBeenCalledWith({
        where: { alertSent: false, [idField]: { [require('../../../app/data').Sequelize.Op.gt]: 0 } },
        order: [[idField, 'ASC']],
        limit: 500
      })
      expect(mockDataProcessingAlert).toHaveBeenCalledTimes(records.length)
      records.forEach(record => {
        expect(mockDataProcessingAlert).toHaveBeenCalledWith(
          {
            process: `sendZeroValueAlerts - ${_}`,
            paymentReference: record.paymentReference,
            paymentAmount: 0,
            message: `Zero value ${_} record found for paymentReference: ${record.paymentReference}`
          },
          ZERO_VALUE_STATEMENT,
          { throwOnPublishError: true }
        )
        expect(updateMock).toHaveBeenCalledWith({ alertSent: true }, { where: { [idField]: record[idField] } })
      })
      expect(logSpy).toHaveBeenCalledWith(`[ZeroValueAlerts] Found ${records.length} unsent zeroValue${logType} zero value records. Sending alerts...`)
      expect(logSpy).toHaveBeenCalledWith(`[ZeroValueAlerts] Processed batch of ${records.length} zeroValue${logType} records.`)
    }
  )

  test.each([
    ['DAX', mockFindAllDax, 'daxId'],
    ['D365', mockFindAllD365, 'd365Id']
  ])(
    'logs when no unsent %s records',
    async (_, findAllMock, idField) => {
      findAllMock.mockResolvedValue([])

      await sendZeroValueAlerts()

      expect(findAllMock).toHaveBeenCalledWith({
        where: { alertSent: false, [idField]: { [require('../../../app/data').Sequelize.Op.gt]: 0 } },
        order: [[idField, 'ASC']],
        limit: 500
      })
      expect(mockDataProcessingAlert).not.toHaveBeenCalled()
    }
  )

  test('handles multiple batches for DAX with exact batch size', async () => {
    const batch1 = Array(500).fill().map((_, i) => ({ daxId: i + 1, paymentReference: `REF${i + 1}`, paymentAmount: 0 }))
    const batch2 = Array(500).fill().map((_, i) => ({ daxId: i + 501, paymentReference: `REF${i + 501}`, paymentAmount: 0 }))
    mockFindAllDax
      .mockResolvedValueOnce(batch1)
      .mockResolvedValueOnce(batch2)
      .mockResolvedValueOnce([])
    mockFindAllD365.mockResolvedValue([])

    await sendZeroValueAlerts()

    expect(mockFindAllDax).toHaveBeenCalledTimes(3)
    expect(mockDataProcessingAlert).toHaveBeenCalledTimes(1000)
  })

  test('handles partial batch for D365', async () => {
    mockFindAllDax.mockResolvedValue([])
    const partialBatch = Array(250).fill().map((_, i) => ({ d365Id: i + 1, paymentReference: `REF${i + 1}`, paymentAmount: 0 }))
    mockFindAllD365
      .mockResolvedValueOnce(partialBatch)
      .mockResolvedValueOnce([])

    await sendZeroValueAlerts()

    expect(mockFindAllD365).toHaveBeenCalledTimes(2)
    expect(mockDataProcessingAlert).toHaveBeenCalledTimes(250)
  })

  test('handles error in processing alert and skips update', async () => {
    const daxRecords = [{ daxId: 1, paymentReference: 'REF1', paymentAmount: 0 }]
    mockFindAllDax.mockResolvedValueOnce(daxRecords).mockResolvedValueOnce([])
    mockFindAllD365.mockResolvedValue([])
    mockDataProcessingAlert.mockRejectedValueOnce(new Error('Publish failed'))

    await sendZeroValueAlerts()

    expect(mockUpdateDax).not.toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalledWith('Failed to send alert for zeroValueDax record 1, skipping update', expect.any(Error))
  })

  test('handles error in database update and logs error', async () => {
    const daxRecords = [{ daxId: 1, paymentReference: 'REF1', paymentAmount: 0 }]
    mockFindAllDax.mockResolvedValueOnce(daxRecords).mockResolvedValueOnce([])
    mockFindAllD365.mockResolvedValue([])
    mockUpdateDax.mockRejectedValueOnce(new Error('Database update failed'))

    await sendZeroValueAlerts()

    expect(errorSpy).toHaveBeenCalledWith('Failed to send alert for zeroValueDax record 1, skipping update', expect.any(Error))
  })

  test('handles mixed success and failure in same batch', async () => {
    const daxRecords = [
      { daxId: 1, paymentReference: 'REF1', paymentAmount: 0 },
      { daxId: 2, paymentReference: 'REF2', paymentAmount: 0 }
    ]
    mockFindAllDax.mockResolvedValueOnce(daxRecords).mockResolvedValueOnce([])
    mockFindAllD365.mockResolvedValue([])
    mockDataProcessingAlert
      .mockResolvedValueOnce()
      .mockRejectedValueOnce(new Error('Second record fails'))

    await sendZeroValueAlerts()

    expect(mockUpdateDax).toHaveBeenCalledTimes(1)
    expect(errorSpy).toHaveBeenCalledTimes(1)
  })
})
