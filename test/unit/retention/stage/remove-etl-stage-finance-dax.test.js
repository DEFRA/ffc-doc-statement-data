const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlStageFinanceDax'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeEtlStageFinanceDax } = require('../../../../app/retention/stage/remove-etl-stage-finance-dax')

describe('removeEtlStageFinanceDax', () => {
  const paymentRefs = ['PR-100', 'PR-101', 'PR-102']
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves()
  })

  test('calls the etlStageFinanceDax accessor with correct parameters', async () => {
    await removeEtlStageFinanceDax(paymentRefs, transaction)

    expect(mockDb.tables.etlStageFinanceDax).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.whereIn).toHaveBeenCalledWith('settlementvoucher', paymentRefs)
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB destroy error')
    mockDb.builder.rejects(error)

    await expect(removeEtlStageFinanceDax(paymentRefs, transaction)).rejects.toThrow('DB destroy error')
  })
})
