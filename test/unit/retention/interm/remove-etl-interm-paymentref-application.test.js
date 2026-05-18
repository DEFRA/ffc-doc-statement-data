const db = require('../../../../app/data')
const { removeEtlIntermPaymentrefApplication } = require('../../../../app/retention/interm/remove-etl-interm-paymentref-application')

jest.mock('../../../../app/data', () => ({
  Sequelize: {
    Op: {
      in: 'in'
    }
  },
  etlIntermPaymentrefApplication: {
    destroy: jest.fn()
  }
}))

describe('removeEtlIntermPaymentrefApplication', () => {
  const paymentRefs = ['PAY-001', 'PAY-002', 'PAY-003']
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlIntermPaymentrefApplication.destroy with correct parameters', async () => {
    db.etlIntermPaymentrefApplication.destroy.mockResolvedValue(3)

    await removeEtlIntermPaymentrefApplication(paymentRefs, transaction)

    expect(db.etlIntermPaymentrefApplication.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlIntermPaymentrefApplication.destroy).toHaveBeenCalledWith({
      where: {
        paymentRef: {
          [db.Sequelize.Op.in]: paymentRefs
        }
      },
      transaction
    })
  })

  test('propagates error when db.etlIntermPaymentrefApplication.destroy rejects', async () => {
    const error = new Error('DB error')
    db.etlIntermPaymentrefApplication.destroy.mockRejectedValue(error)

    await expect(removeEtlIntermPaymentrefApplication(paymentRefs, transaction)).rejects.toThrow('DB error')
  })
})
