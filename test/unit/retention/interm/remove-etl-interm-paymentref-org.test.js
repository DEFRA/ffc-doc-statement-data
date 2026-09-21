const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlIntermPaymentrefOrg'])

jest.mock('../../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeEtlIntermPaymentrefOrg } = require('../../../../app/retention/interm/remove-etl-interm-paymentref-org')

describe('removeEtlIntermPaymentrefOrg', () => {
  const paymentRefs = ['PAY-001', 'PAY-002', 'PAY-003']
  const frn = 987654
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(3)
  })

  test('calls the etlIntermPaymentrefOrg accessor with correct parameters', async () => {
    await removeEtlIntermPaymentrefOrg(paymentRefs, frn, transaction)

    expect(mockDb.tables.etlIntermPaymentrefOrg).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.whereIn).toHaveBeenCalledWith('paymentRef', paymentRefs)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ frn })
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB error')
    mockDb.builder.rejects(error)

    await expect(removeEtlIntermPaymentrefOrg(paymentRefs, frn, transaction)).rejects.toThrow('DB error')
  })
})
