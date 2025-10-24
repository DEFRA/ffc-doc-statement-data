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
    mockDataProcessingAlert.mockReset()
    mockFindAllDax.mockReset()
    mockFindAllD365.mockReset()
    mockUpdateDax.mockReset()
    mockUpdateD365.mockReset()
    mockDataProcessingAlert.mockResolvedValue()
    mockUpdateDax.mockResolvedValue()
    mockUpdateD365.mockResolvedValue()
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
    errorSpy.mockRestore()
  })

  test('processes and sends alerts for unsent DAX records in single batch', async () => {
    const daxRecords = [
      { daxId: 1, paymentReference: 'REF1', paymentAmount: 0 },
      { daxId: 2, paymentReference: 'REF2', paymentAmount: 0 }
    ]
    mockFindAllDax
      .mockResolvedValueOnce(daxRecords)
      .mockResolvedValueOnce([])
    mockFindAllD365.mockResolvedValue([])

    await sendZeroValueAlerts()

    expect(mockFindAllDax).toHaveBeenCalledWith({
      where: { alertSent: false, daxId: { [require('../../../app/data').Sequelize.Op.gt]: 0 } },
      order: [['daxId', 'ASC']],
      limit: 500
    })
    expect(mockDataProcessingAlert).toHaveBeenCalledTimes(2)
    expect(mockDataProcessingAlert).toHaveBeenCalledWith(
      {
        process: 'sendZeroValueAlerts - DAX',
        paymentReference: 'REF1',
        paymentAmount: 0,
        message: 'Zero value DAX record found for paymentReference: REF1'
      },
      ZERO_VALUE_STATEMENT,
      { throwOnPublishError: true }
    )
    expect(mockDataProcessingAlert).toHaveBeenCalledWith(
      {
        process: 'sendZeroValueAlerts - DAX',
        paymentReference: 'REF2',
        paymentAmount: 0,
        message: 'Zero value DAX record found for paymentReference: REF2'
      },
      ZERO_VALUE_STATEMENT,
      { throwOnPublishError: true }
    )
    expect(mockUpdateDax).toHaveBeenCalledWith({ alertSent: true }, { where: { daxId: 1 } })
    expect(mockUpdateDax).toHaveBeenCalledWith({ alertSent: true }, { where: { daxId: 2 } })
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Found 2 unsent zeroValueDax zero value records. Sending alerts...')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Processed batch of 2 zeroValueDax records.')
  })

  test('logs when no unsent DAX records', async () => {
    mockFindAllDax.mockResolvedValue([])
    mockFindAllD365.mockResolvedValue([])

    await sendZeroValueAlerts()

    expect(mockFindAllDax).toHaveBeenCalledWith({
      where: { alertSent: false, daxId: { [require('../../../app/data').Sequelize.Op.gt]: 0 } },
      order: [['daxId', 'ASC']],
      limit: 500
    })
    expect(mockDataProcessingAlert).not.toHaveBeenCalled()
    expect(mockUpdateDax).not.toHaveBeenCalled()
  })

  test('processes and sends alerts for unsent D365 records', async () => {
    mockFindAllDax.mockResolvedValue([])
    const d365Records = [{ d365Id: 3, paymentReference: 'REF3', paymentAmount: 0 }]
    mockFindAllD365
      .mockResolvedValueOnce(d365Records)
      .mockResolvedValueOnce([])

    await sendZeroValueAlerts()

    expect(mockFindAllD365).toHaveBeenCalledWith({
      where: { alertSent: false, d365Id: { [require('../../../app/data').Sequelize.Op.gt]: 0 } },
      order: [['d365Id', 'ASC']],
      limit: 500
    })
    expect(mockDataProcessingAlert).toHaveBeenCalledWith(
      {
        process: 'sendZeroValueAlerts - D365',
        paymentReference: 'REF3',
        paymentAmount: 0,
        message: 'Zero value D365 record found for paymentReference: REF3'
      },
      ZERO_VALUE_STATEMENT,
      { throwOnPublishError: true }
    )
    expect(mockUpdateD365).toHaveBeenCalledWith({ alertSent: true }, { where: { d365Id: 3 } })
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Found 1 unsent zeroValueD365 zero value records. Sending alerts...')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Processed batch of 1 zeroValueD365 records.')
  })

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
    expect(mockFindAllDax).toHaveBeenNthCalledWith(1, {
      where: { alertSent: false, daxId: { [require('../../../app/data').Sequelize.Op.gt]: 0 } },
      order: [['daxId', 'ASC']],
      limit: 500
    })
    expect(mockFindAllDax).toHaveBeenNthCalledWith(2, {
      where: { alertSent: false, daxId: { [require('../../../app/data').Sequelize.Op.gt]: 500 } },
      order: [['daxId', 'ASC']],
      limit: 500
    })
    expect(mockFindAllDax).toHaveBeenNthCalledWith(3, {
      where: { alertSent: false, daxId: { [require('../../../app/data').Sequelize.Op.gt]: 1000 } },
      order: [['daxId', 'ASC']],
      limit: 500
    })
    expect(mockDataProcessingAlert).toHaveBeenCalledTimes(1000)
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Found 500 unsent zeroValueDax zero value records. Sending alerts...')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Processed batch of 500 zeroValueDax records.')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Found 500 unsent zeroValueDax zero value records. Sending alerts...')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Processed batch of 500 zeroValueDax records.')
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
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Found 250 unsent zeroValueD365 zero value records. Sending alerts...')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Processed batch of 250 zeroValueD365 records.')
  })

  test('handles error in processing alert and skips update', async () => {
    const daxRecords = [{ daxId: 1, paymentReference: 'REF1', paymentAmount: 0 }]
    mockFindAllDax
      .mockResolvedValueOnce(daxRecords)
      .mockResolvedValueOnce([])
    mockFindAllD365.mockResolvedValue([])
    mockDataProcessingAlert.mockRejectedValueOnce(new Error('Publish failed'))

    await sendZeroValueAlerts()

    expect(mockDataProcessingAlert).toHaveBeenCalledTimes(1)
    expect(mockUpdateDax).not.toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalledWith('Failed to send alert for zeroValueDax record 1, skipping update', expect.any(Error))
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Found 1 unsent zeroValueDax zero value records. Sending alerts...')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Processed batch of 1 zeroValueDax records.')
  })

  test('handles error in database update and logs error', async () => {
    const daxRecords = [{ daxId: 1, paymentReference: 'REF1', paymentAmount: 0 }]
    mockFindAllDax
      .mockResolvedValueOnce(daxRecords)
      .mockResolvedValueOnce([])
    mockFindAllD365.mockResolvedValue([])
    mockUpdateDax.mockRejectedValueOnce(new Error('Database update failed'))

    await sendZeroValueAlerts()

    expect(mockDataProcessingAlert).toHaveBeenCalledTimes(1)
    expect(mockUpdateDax).toHaveBeenCalledWith({ alertSent: true }, { where: { daxId: 1 } })
    expect(errorSpy).toHaveBeenCalledWith('Failed to send alert for zeroValueDax record 1, skipping update', expect.any(Error))
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Found 1 unsent zeroValueDax zero value records. Sending alerts...')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Processed batch of 1 zeroValueDax records.')
  })

  test('processes both DAX and D365 records in separate batches', async () => {
    const daxRecords = [{ daxId: 1, paymentReference: 'REF1', paymentAmount: 0 }]
    const d365Records = [{ d365Id: 2, paymentReference: 'REF2', paymentAmount: 0 }]
    mockFindAllDax
      .mockResolvedValueOnce(daxRecords)
      .mockResolvedValueOnce([])
    mockFindAllD365
      .mockResolvedValueOnce(d365Records)
      .mockResolvedValueOnce([])

    await sendZeroValueAlerts()

    expect(mockDataProcessingAlert).toHaveBeenCalledTimes(2)
    expect(mockUpdateDax).toHaveBeenCalledWith({ alertSent: true }, { where: { daxId: 1 } })
    expect(mockUpdateD365).toHaveBeenCalledWith({ alertSent: true }, { where: { d365Id: 2 } })
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Found 1 unsent zeroValueDax zero value records. Sending alerts...')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Processed batch of 1 zeroValueDax records.')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Found 1 unsent zeroValueD365 zero value records. Sending alerts...')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Processed batch of 1 zeroValueD365 records.')
  })

  test('handles offset calculation correctly with multiple batches', async () => {
    const batch1 = Array(500).fill().map((_, i) => ({ daxId: i + 1, paymentReference: `REF${i + 1}`, paymentAmount: 0 }))
    const batch2 = Array(100).fill().map((_, i) => ({ daxId: i + 501, paymentReference: `REF${i + 501}`, paymentAmount: 0 }))
    mockFindAllDax
      .mockResolvedValueOnce(batch1)
      .mockResolvedValueOnce(batch2)
      .mockResolvedValueOnce([])
    mockFindAllD365.mockResolvedValue([])

    await sendZeroValueAlerts()

    expect(mockFindAllDax).toHaveBeenCalledTimes(3)
    expect(mockFindAllDax).toHaveBeenNthCalledWith(1, {
      where: { alertSent: false, daxId: { [require('../../../app/data').Sequelize.Op.gt]: 0 } },
      order: [['daxId', 'ASC']],
      limit: 500
    })
    expect(mockFindAllDax).toHaveBeenNthCalledWith(2, {
      where: { alertSent: false, daxId: { [require('../../../app/data').Sequelize.Op.gt]: 500 } },
      order: [['daxId', 'ASC']],
      limit: 500
    })
    expect(mockDataProcessingAlert).toHaveBeenCalledTimes(600)
  })

  test('handles mixed success and failure in same batch', async () => {
    const daxRecords = [
      { daxId: 1, paymentReference: 'REF1', paymentAmount: 0 },
      { daxId: 2, paymentReference: 'REF2', paymentAmount: 0 }
    ]
    mockFindAllDax
      .mockResolvedValueOnce(daxRecords)
      .mockResolvedValueOnce([])
    mockFindAllD365.mockResolvedValue([])
    mockDataProcessingAlert
      .mockResolvedValueOnce() // First record succeeds
      .mockRejectedValueOnce(new Error('Second record fails')) // Second record fails

    await sendZeroValueAlerts()

    expect(mockDataProcessingAlert).toHaveBeenCalledTimes(2)
    expect(mockUpdateDax).toHaveBeenCalledTimes(1) // Only first record should be updated
    expect(mockUpdateDax).toHaveBeenCalledWith({ alertSent: true }, { where: { daxId: 1 } })
    expect(errorSpy).toHaveBeenCalledWith('Failed to send alert for zeroValueDax record 2, skipping update', expect.any(Error))
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Found 2 unsent zeroValueDax zero value records. Sending alerts...')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Processed batch of 2 zeroValueDax records.')
  })

  test('handles exact count boundary conditions', async () => {
    const batch = Array(500).fill().map((_, i) => ({ daxId: i + 1, paymentReference: `REF${i + 1}`, paymentAmount: 0 }))
    mockFindAllDax
      .mockResolvedValueOnce(batch)
      .mockResolvedValueOnce([])
    mockFindAllD365.mockResolvedValue([])

    await sendZeroValueAlerts()

    expect(mockFindAllDax).toHaveBeenCalledTimes(2)
    expect(mockDataProcessingAlert).toHaveBeenCalledTimes(500)
  })

  test('handles multiple batches for D365', async () => {
    mockFindAllDax.mockResolvedValue([])
    const batch1 = Array(500).fill().map((_, i) => ({ d365Id: i + 1, paymentReference: `REF${i + 1}`, paymentAmount: 0 }))
    const batch2 = Array(200).fill().map((_, i) => ({ d365Id: i + 501, paymentReference: `REF${i + 501}`, paymentAmount: 0 }))
    mockFindAllD365
      .mockResolvedValueOnce(batch1)
      .mockResolvedValueOnce(batch2)
      .mockResolvedValueOnce([])

    await sendZeroValueAlerts()

    expect(mockFindAllD365).toHaveBeenCalledTimes(3)
    expect(mockFindAllD365).toHaveBeenNthCalledWith(1, {
      where: { alertSent: false, d365Id: { [require('../../../app/data').Sequelize.Op.gt]: 0 } },
      order: [['d365Id', 'ASC']],
      limit: 500
    })
    expect(mockFindAllD365).toHaveBeenNthCalledWith(2, {
      where: { alertSent: false, d365Id: { [require('../../../app/data').Sequelize.Op.gt]: 500 } },
      order: [['d365Id', 'ASC']],
      limit: 500
    })
    expect(mockDataProcessingAlert).toHaveBeenCalledTimes(700)
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Found 500 unsent zeroValueD365 zero value records. Sending alerts...')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Processed batch of 500 zeroValueD365 records.')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Found 200 unsent zeroValueD365 zero value records. Sending alerts...')
    expect(logSpy).toHaveBeenCalledWith('[ZeroValueAlerts] Processed batch of 200 zeroValueD365 records.')
  })
})
