const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlIntermTotalZeroValues'])

jest.mock('../../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeEtlIntermTotalZeroValues } = require('../../../../app/retention/interm/remove-etl-interm-total-zero-values')

describe('removeEtlIntermTotalZeroValues', () => {
  const paymentRefs = ['PAY-001', 'PAY-002', 'PAY-003']
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(3)
  })

  test('calls the etlIntermTotalZeroValues accessor with correct parameters', async () => {
    await removeEtlIntermTotalZeroValues(paymentRefs, transaction)

    expect(mockDb.tables.etlIntermTotalZeroValues).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.whereIn).toHaveBeenCalledWith('paymentRef', paymentRefs)
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB error')
    mockDb.builder.rejects(error)

    await expect(removeEtlIntermTotalZeroValues(paymentRefs, transaction)).rejects.toThrow('DB error')
  })
})
