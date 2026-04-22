const db = require('../../../../app/data')
const { removeEtlIntermTotalZeroValues } = require('../../../../app/retention/interm/remove-etl-interm-total-zero-values')

jest.mock('../../../../app/data', () => ({
  Sequelize: {
    Op: {
      in: 'in'
    }
  },
  etlIntermTotalZeroValues: {
    destroy: jest.fn()
  }
}))

describe('removeEtlIntermTotalZeroValues', () => {
  const paymentRefs = ['PAY-001', 'PAY-002', 'PAY-003']
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlIntermTotalZeroValues.destroy with correct parameters', async () => {
    db.etlIntermTotalZeroValues.destroy.mockResolvedValue(3)

    await removeEtlIntermTotalZeroValues(paymentRefs, transaction)

    expect(db.etlIntermTotalZeroValues.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlIntermTotalZeroValues.destroy).toHaveBeenCalledWith({
      where: {
        paymentRef: {
          [db.Sequelize.Op.in]: paymentRefs
        }
      },
      transaction
    })
  })

  test('propagates error when db.etlIntermTotalZeroValues.destroy rejects', async () => {
    const error = new Error('DB error')
    db.etlIntermTotalZeroValues.destroy.mockRejectedValue(error)

    await expect(removeEtlIntermTotalZeroValues(paymentRefs, transaction)).rejects.toThrow('DB error')
  })
})
