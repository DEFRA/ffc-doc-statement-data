const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlIntermAppCalcResultsDelinkPayment'])

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

  test('calls the etlIntermAppCalcResultsDelinkPayment accessor with correct parameters', async () => {
    await removeEtlIntermAppCalcResultsDelinkPayments(applicationId, frn, transaction)

    expect(mockDb.tables.etlIntermAppCalcResultsDelinkPayment).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ applicationId, frn })
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB error')
    mockDb.builder.rejects(error)

    await expect(removeEtlIntermAppCalcResultsDelinkPayments(applicationId, frn, transaction)).rejects.toThrow('DB error')
  })
})
