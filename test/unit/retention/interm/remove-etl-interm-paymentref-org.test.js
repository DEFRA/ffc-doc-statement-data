const db = require('../../../../app/data')
const { removeEtlIntermPaymentrefOrg } = require('../../../../app/retention/interm/remove-etl-interm-paymentref-org')

jest.mock('../../../../app/data', () => ({
  Sequelize: {
    Op: {
      in: 'in'
    }
  },
  etlIntermPaymentrefOrg: {
    destroy: jest.fn()
  }
}))

describe('removeEtlIntermPaymentrefOrg', () => {
  const paymentRefs = ['PAY-001', 'PAY-002', 'PAY-003']
  const frn = 987654
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlIntermPaymentrefOrg.destroy with correct parameters', async () => {
    db.etlIntermPaymentrefOrg.destroy.mockResolvedValue(3)

    await removeEtlIntermPaymentrefOrg(paymentRefs, frn, transaction)

    expect(db.etlIntermPaymentrefOrg.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlIntermPaymentrefOrg.destroy).toHaveBeenCalledWith({
      where: {
        paymentRef: {
          [db.Sequelize.Op.in]: paymentRefs
        },
        frn
      },
      transaction
    })
  })

  test('propagates error when db.etlIntermPaymentrefOrg.destroy rejects', async () => {
    const error = new Error('DB error')
    db.etlIntermPaymentrefOrg.destroy.mockRejectedValue(error)

    await expect(removeEtlIntermPaymentrefOrg(paymentRefs, frn, transaction)).rejects.toThrow('DB error')
  })
})
