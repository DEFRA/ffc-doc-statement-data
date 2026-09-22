const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlIntermTotal'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeEtlIntermTotal } = require('../../../../app/retention/interm/remove-etl-interm-total')

describe('removeEtlIntermTotal', () => {
  const paymentRefs = ['PAY-001', 'PAY-002', 'PAY-003']
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(3)
  })

  test('calls the etlIntermTotal accessor with correct parameters', async () => {
    await removeEtlIntermTotal(paymentRefs, transaction)

    expect(mockDb.tables.etlIntermTotal).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.whereIn).toHaveBeenCalledWith('paymentRef', paymentRefs)
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB error')
    mockDb.builder.rejects(error)

    await expect(removeEtlIntermTotal(paymentRefs, transaction)).rejects.toThrow('DB error')
  })
})
