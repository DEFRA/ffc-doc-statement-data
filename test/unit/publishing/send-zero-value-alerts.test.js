const mockDataProcessingAlert = jest.fn()

jest.mock('ffc-alerting-utils', () => ({
  dataProcessingAlert: mockDataProcessingAlert
}))

const { createKnexMock, createQueryBuilder } = require('../../helpers/mock-knex')

const mockDb = createKnexMock(['zeroValueD365'])

jest.mock('../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { ZERO_VALUE_STATEMENT } = require('../../../app/constants/alerts')
const sendZeroValueAlerts = require('../../../app/publishing/send-zero-value-alerts')

// Queues a builder that resolves `records` for the first call to the accessor,
// and a builder resolving `[]` for every call after (both the pagination-ending
// select and the per-record update calls, whose resolved value is unused).
const queueBatch = (records) => {
  const batchBuilder = createQueryBuilder()
  batchBuilder.resolves(records)
  const restBuilder = createQueryBuilder()
  restBuilder.resolves([])
  mockDb.tables.zeroValueD365
    .mockReturnValueOnce(batchBuilder)
    .mockReturnValue(restBuilder)
  return { batchBuilder, restBuilder }
}

describe('sendZeroValueAlerts', () => {
  let logSpy
  let errorSpy

  beforeEach(() => {
    jest.clearAllMocks()

    mockDataProcessingAlert.mockReset().mockResolvedValue()

    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    logSpy.mockRestore()
    errorSpy.mockRestore()
  })

  test('processes and sends alerts for unsent D365 records in a single batch', async () => {
    const records = [
      { d365Id: 1, paymentReference: 'REF1', paymentAmount: 0 },
      { d365Id: 2, paymentReference: 'REF2', paymentAmount: 0 }
    ]
    const { batchBuilder, restBuilder } = queueBatch(records)

    await sendZeroValueAlerts()

    expect(batchBuilder.where).toHaveBeenCalledWith({ alertSent: false })
    expect(batchBuilder.where).toHaveBeenCalledWith('d365Id', '>', 0)
    expect(batchBuilder.orderBy).toHaveBeenCalledWith('d365Id', 'asc')
    expect(batchBuilder.limit).toHaveBeenCalledWith(500)

    expect(mockDataProcessingAlert).toHaveBeenCalledTimes(records.length)
    records.forEach(record => {
      expect(mockDataProcessingAlert).toHaveBeenCalledWith(
        {
          process: 'sendZeroValueAlerts - D365',
          paymentReference: record.paymentReference,
          paymentAmount: 0,
          message: `Zero value D365 record found for paymentReference: ${record.paymentReference}`
        },
        ZERO_VALUE_STATEMENT,
        { throwOnPublishError: true }
      )
      expect(restBuilder.where).toHaveBeenCalledWith({ d365Id: record.d365Id })
    })
    expect(restBuilder.update).toHaveBeenCalledWith({ alertSent: true })
    expect(logSpy).toHaveBeenCalledWith(`[ZeroValueAlerts] Found ${records.length} unsent zeroValueD365 zero value records. Sending alerts...`)
    expect(logSpy).toHaveBeenCalledWith(`[ZeroValueAlerts] Processed batch of ${records.length} zeroValueD365 records.`)
  })

  test('logs when no unsent D365 records', async () => {
    const builder = createQueryBuilder()
    builder.resolves([])
    mockDb.tables.zeroValueD365.mockReturnValue(builder)

    await sendZeroValueAlerts()

    expect(builder.where).toHaveBeenCalledWith({ alertSent: false })
    expect(builder.where).toHaveBeenCalledWith('d365Id', '>', 0)
    expect(mockDataProcessingAlert).not.toHaveBeenCalled()
  })

  test('handles partial batch for D365', async () => {
    const partialBatch = Array(250).fill().map((_, i) => ({ d365Id: i + 1, paymentReference: `REF${i + 1}`, paymentAmount: 0 }))
    queueBatch(partialBatch)

    await sendZeroValueAlerts()

    expect(mockDataProcessingAlert).toHaveBeenCalledTimes(250)
  })

  test('handles error in processing alert and skips update', async () => {
    const d365Records = [{ d365Id: 1, paymentReference: 'REF1', paymentAmount: 0 }]
    const { restBuilder } = queueBatch(d365Records)
    mockDataProcessingAlert.mockRejectedValueOnce(new Error('Publish failed'))

    await sendZeroValueAlerts()

    expect(restBuilder.update).not.toHaveBeenCalled()
    expect(errorSpy).toHaveBeenCalledWith('Failed to send alert for zeroValueD365 record 1, skipping update', expect.any(Error))
  })

  test('handles error in database update and logs error', async () => {
    const d365Records = [{ d365Id: 1, paymentReference: 'REF1', paymentAmount: 0 }]

    const batchBuilder = createQueryBuilder()
    batchBuilder.resolves(d365Records)
    const updateBuilder = createQueryBuilder()
    updateBuilder.rejects(new Error('Database update failed'))
    const emptyBuilder = createQueryBuilder()
    emptyBuilder.resolves([])

    mockDb.tables.zeroValueD365
      .mockReturnValueOnce(batchBuilder)
      .mockReturnValueOnce(updateBuilder)
      .mockReturnValue(emptyBuilder)

    await sendZeroValueAlerts()

    expect(errorSpy).toHaveBeenCalledWith('Failed to send alert for zeroValueD365 record 1, skipping update', expect.any(Error))
  })

  test('handles mixed success and failure in same batch', async () => {
    const d365Records = [
      { d365Id: 1, paymentReference: 'REF1', paymentAmount: 0 },
      { d365Id: 2, paymentReference: 'REF2', paymentAmount: 0 }
    ]
    const { restBuilder } = queueBatch(d365Records)
    mockDataProcessingAlert
      .mockResolvedValueOnce()
      .mockRejectedValueOnce(new Error('Second record fails'))

    await sendZeroValueAlerts()

    expect(restBuilder.update).toHaveBeenCalledTimes(1)
    expect(errorSpy).toHaveBeenCalledTimes(1)
  })
})
