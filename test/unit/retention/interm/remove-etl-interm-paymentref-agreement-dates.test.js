const db = require('../../../../app/data')
const { removeEtlIntermPaymentrefAgreementDates } = require('../../../../app/retention/interm/remove-etl-interm-paymentref-agreement-dates')

jest.mock('../../../../app/data', () => ({
  Sequelize: {
    Op: {
      in: 'in'
    }
  },
  etlIntermPaymentrefAgreementDates: {
    destroy: jest.fn()
  }
}))

describe('removeEtlIntermPaymentrefAgreementDates', () => {
  const paymentRefs = ['PAY-001', 'PAY-002', 'PAY-003']
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlIntermPaymentrefAgreementDates.destroy with correct parameters', async () => {
    db.etlIntermPaymentrefAgreementDates.destroy.mockResolvedValue(3)

    await removeEtlIntermPaymentrefAgreementDates(paymentRefs, transaction)

    expect(db.etlIntermPaymentrefAgreementDates.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlIntermPaymentrefAgreementDates.destroy).toHaveBeenCalledWith({
      where: {
        paymentRef: {
          [db.Sequelize.Op.in]: paymentRefs
        }
      },
      transaction
    })
  })

  test('propagates error when db.etlIntermPaymentrefAgreementDates.destroy rejects', async () => {
    const error = new Error('DB error')
    db.etlIntermPaymentrefAgreementDates.destroy.mockRejectedValue(error)

    await expect(removeEtlIntermPaymentrefAgreementDates(paymentRefs, transaction)).rejects.toThrow('DB error')
  })
})
