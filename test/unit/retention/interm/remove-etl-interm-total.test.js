const db = require('../../../../app/data')
const { removeEtlIntermTotal } = require('../../../../app/retention/interm/remove-etl-interm-total')

jest.mock('../../../../app/data', () => ({
  Sequelize: {
    Op: {
      in: 'in'
    }
  },
  etlIntermTotal: {
    destroy: jest.fn()
  }
}))

describe('removeEtlIntermTotal', () => {
  const paymentRefs = ['PAY-001', 'PAY-002', 'PAY-003']
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlIntermTotal.destroy with correct parameters', async () => {
    db.etlIntermTotal.destroy.mockResolvedValue(3)

    await removeEtlIntermTotal(paymentRefs, transaction)

    expect(db.etlIntermTotal.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlIntermTotal.destroy).toHaveBeenCalledWith({
      where: {
        paymentRef: {
          [db.Sequelize.Op.in]: paymentRefs
        }
      },
      transaction
    })
  })

  test('propagates error when db.etlIntermTotal.destroy rejects', async () => {
    const error = new Error('DB error')
    db.etlIntermTotal.destroy.mockRejectedValue(error)

    await expect(removeEtlIntermTotal(paymentRefs, transaction)).rejects.toThrow('DB error')
  })
})
