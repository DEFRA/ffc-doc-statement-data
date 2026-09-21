const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlIntermPaymentrefApplication'])

jest.mock('../../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeEtlIntermPaymentrefApplication } = require('../../../../app/retention/interm/remove-etl-interm-paymentref-application')

describe('removeEtlIntermPaymentrefApplication', () => {
  const paymentRefs = ['PAY-001', 'PAY-002', 'PAY-003']
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(3)
  })

  test('calls the etlIntermPaymentrefApplication accessor with correct parameters', async () => {
    await removeEtlIntermPaymentrefApplication(paymentRefs, transaction)

    expect(mockDb.tables.etlIntermPaymentrefApplication).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.whereIn).toHaveBeenCalledWith('paymentRef', paymentRefs)
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB error')
    mockDb.builder.rejects(error)

    await expect(removeEtlIntermPaymentrefApplication(paymentRefs, transaction)).rejects.toThrow('DB error')
  })
})
