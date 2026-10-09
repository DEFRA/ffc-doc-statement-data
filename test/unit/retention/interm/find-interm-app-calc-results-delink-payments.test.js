const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlIntermAppCalcResultsDelinkPayment'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { findIntermAppCalcResultsDelinkPayments } = require('../../../../app/retention/interm/find-interm-app-calc-results-delink-payments')

describe('findIntermAppCalcResultsDelinkPayments', () => {
  const applicationId = 'APP-2020'
  const frn = 987654
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls the etlIntermAppCalcResultsDelinkPayment accessor with correct parameters', async () => {
    const mockResult = [{ calculationId: 1 }, { calculationId: 2 }]
    mockDb.builder.resolves(mockResult)

    const result = await findIntermAppCalcResultsDelinkPayments(applicationId, frn, transaction)

    expect(mockDb.tables.etlIntermAppCalcResultsDelinkPayment).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ applicationId, frn })
    expect(mockDb.builder.select).toHaveBeenCalledWith('calculationId')
    expect(result).toBe(mockResult)
  })

  test('calls the etlIntermAppCalcResultsDelinkPayment accessor without a transaction when none is provided', async () => {
    mockDb.builder.resolves([])

    await findIntermAppCalcResultsDelinkPayments(applicationId, frn)

    expect(mockDb.tables.etlIntermAppCalcResultsDelinkPayment).toHaveBeenCalledWith(undefined)
  })

  test('propagates error when the query rejects', async () => {
    const error = new Error('DB error')
    mockDb.builder.rejects(error)

    await expect(findIntermAppCalcResultsDelinkPayments(applicationId, frn, transaction)).rejects.toThrow('DB error')
  })
})
