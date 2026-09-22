const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlStageAppCalcResultsDelinkPayment'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeEtlStageAppCalcResultsDelinkPayments } = require('../../../../app/retention/stage/remove-etl-stage-app-calc-results-delink-payments')

describe('removeEtlStageAppCalcResultsDelinkPayments', () => {
  const calculationIds = [301, 302, 303]
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test('calls the etlStageAppCalcResultsDelinkPayment accessor with correct parameters', async () => {
    await removeEtlStageAppCalcResultsDelinkPayments(calculationIds, transaction)

    expect(mockDb.tables.etlStageAppCalcResultsDelinkPayment).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.whereIn).toHaveBeenCalledWith('calculationId', calculationIds)
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('calls the etlStageAppCalcResultsDelinkPayment accessor without a transaction when none is provided', async () => {
    await removeEtlStageAppCalcResultsDelinkPayments(calculationIds)

    expect(mockDb.tables.etlStageAppCalcResultsDelinkPayment).toHaveBeenCalledWith(undefined)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB destroy error')
    mockDb.builder.rejects(error)

    await expect(removeEtlStageAppCalcResultsDelinkPayments(calculationIds, transaction)).rejects.toThrow('DB destroy error')
  })
})
