const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlIntermPaymentrefAgreementDates'])

jest.mock('../../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { removeEtlIntermPaymentrefAgreementDates } = require('../../../../app/retention/interm/remove-etl-interm-paymentref-agreement-dates')

describe('removeEtlIntermPaymentrefAgreementDates', () => {
  const paymentRefs = ['PAY-001', 'PAY-002', 'PAY-003']
  const transaction = mockDb.trx

  beforeEach(() => {
    jest.clearAllMocks()
    mockDb.builder.resolves(3)
  })

  test('calls the etlIntermPaymentrefAgreementDates accessor with correct parameters', async () => {
    await removeEtlIntermPaymentrefAgreementDates(paymentRefs, transaction)

    expect(mockDb.tables.etlIntermPaymentrefAgreementDates).toHaveBeenCalledWith(transaction)
    expect(mockDb.builder.whereIn).toHaveBeenCalledWith('paymentRef', paymentRefs)
    expect(mockDb.builder.del).toHaveBeenCalledTimes(1)
  })

  test('propagates error when the delete rejects', async () => {
    const error = new Error('DB error')
    mockDb.builder.rejects(error)

    await expect(removeEtlIntermPaymentrefAgreementDates(paymentRefs, transaction)).rejects.toThrow('DB error')
  })
})
