const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlIntermAppCalcResultsDelinkPayments'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeEtlIntermAppCalcResultsDelinkPayments } = require('../../../../app/retention/interm/remove-etl-interm-app-calc-results-delink-payments')

describe('removeEtlIntermAppCalcResultsDelinkPayments', () => {
  const applicationId = 'APP-2020'
  const frn = 987654
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(1)
  })

  test('calls the etlIntermAppCalcResultsDelinkPayments accessor with correct parameters', async () => {
    await removeEtlIntermAppCalcResultsDelinkPayments(applicationId, frn, transaction)

    expect(mockDb.tables.etlIntermAppCalcResultsDelinkPayments).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ applicationId, frn })
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('calls the etlIntermAppCalcResultsDelinkPayments accessor without a transaction when none is provided', async () => {
    await removeEtlIntermAppCalcResultsDelinkPayments(applicationId, frn)

    expect(mockDb.tables.etlIntermAppCalcResultsDelinkPayments).toHaveBeenCalledWith(undefined)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB error')
    mockDb.builder.rejects(error)

    await expect(removeEtlIntermAppCalcResultsDelinkPayments(applicationId, frn, transaction)).rejects.toThrow('DB error')
  })
})
