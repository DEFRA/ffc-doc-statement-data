const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlIntermFinanceDax'])

jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { findIntermPaymentRefs } = require('../../../../app/retention/interm/find-interm-payment-refs')

describe('findIntermPaymentRefs', () => {
  const claimId = 'AGR-123'
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls the etlIntermFinanceDax accessor with correct parameters', async () => {
    const mockResult = [
      { paymentRef: 'PAY-001' },
      { paymentRef: 'PAY-002' }
    ]
    mockDb.builder.resolves(mockResult)

    const result = await findIntermPaymentRefs(claimId, transaction)

    expect(mockDb.tables.etlIntermFinanceDax).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ claimId })
    expect(mockDb.builder.select).toHaveBeenCalledWith('paymentRef')
    expect(result).toBe(mockResult)
  })

  test('calls the etlIntermFinanceDax accessor without a transaction when none is provided', async () => {
    mockDb.builder.resolves([])

    await findIntermPaymentRefs(claimId)

    expect(mockDb.tables.etlIntermFinanceDax).toHaveBeenCalledWith(undefined)
  })

  test('returns empty array when no records found', async () => {
    mockDb.builder.resolves([])

    const result = await findIntermPaymentRefs(claimId, transaction)

    expect(result).toEqual([])
  })

  test('propagates error when the query rejects', async () => {
    const error = new Error('DB error')
    mockDb.builder.rejects(error)

    await expect(findIntermPaymentRefs(claimId, transaction)).rejects.toThrow('DB error')
  })
})
