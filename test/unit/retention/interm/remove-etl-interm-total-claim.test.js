const db = require('../../../../app/data')
const { removeEtlIntermTotalClaim } = require('../../../../app/retention/interm/remove-etl-interm-total-claim')

jest.mock('../../../../app/data', () => ({
  Sequelize: {
    Op: {
      in: 'in'
    }
  },
  etlIntermTotalClaim: {
    destroy: jest.fn()
  }
}))

describe('removeEtlIntermTotalClaim', () => {
  const paymentRefs = ['PAY-001', 'PAY-002', 'PAY-003']
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlIntermTotalClaim.destroy with correct parameters', async () => {
    db.etlIntermTotalClaim.destroy.mockResolvedValue(3)

    await removeEtlIntermTotalClaim(paymentRefs, transaction)

    expect(db.etlIntermTotalClaim.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlIntermTotalClaim.destroy).toHaveBeenCalledWith({
      where: {
        paymentRef: {
          [db.Sequelize.Op.in]: paymentRefs
        }
      },
      transaction
    })
  })

  test('propagates error when db.etlIntermTotalClaim.destroy rejects', async () => {
    const error = new Error('DB error')
    db.etlIntermTotalClaim.destroy.mockRejectedValue(error)

    await expect(removeEtlIntermTotalClaim(paymentRefs, transaction)).rejects.toThrow('DB error')
  })
})
