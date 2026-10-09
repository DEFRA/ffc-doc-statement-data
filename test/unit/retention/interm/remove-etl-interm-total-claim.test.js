const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlIntermTotalClaim'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeEtlIntermTotalClaim } = require('../../../../app/retention/interm/remove-etl-interm-total-claim')

describe('removeEtlIntermTotalClaim', () => {
  const paymentRefs = ['PAY-001', 'PAY-002', 'PAY-003']
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(3)
  })

  test('calls the etlIntermTotalClaim accessor with correct parameters', async () => {
    await removeEtlIntermTotalClaim(paymentRefs, transaction)

    expect(mockDb.tables.etlIntermTotalClaim).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.whereIn).toHaveBeenCalledWith('paymentRef', paymentRefs)
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('calls the etlIntermTotalClaim accessor without a transaction when none is provided', async () => {
    await removeEtlIntermTotalClaim(paymentRefs)

    expect(mockDb.tables.etlIntermTotalClaim).toHaveBeenCalledWith(undefined)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB error')
    mockDb.builder.rejects(error)

    await expect(removeEtlIntermTotalClaim(paymentRefs, transaction)).rejects.toThrow('DB error')
  })
})
