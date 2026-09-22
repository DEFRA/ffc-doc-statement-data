const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlIntermFinanceDax'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeEtlIntermFinanceDax } = require('../../../../app/retention/interm/remove-etl-interm-finance-dax')

describe('removeEtlIntermFinanceDax', () => {
  const claimId = 'AGR-123'
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(1)
  })

  test('calls the etlIntermFinanceDax accessor with correct parameters', async () => {
    await removeEtlIntermFinanceDax(claimId, transaction)

    expect(mockDb.tables.etlIntermFinanceDax).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ claimId })
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB error')
    mockDb.builder.rejects(error)

    await expect(removeEtlIntermFinanceDax(claimId, transaction)).rejects.toThrow('DB error')
  })
})
