const db = require('../../../../app/data')
const { removeEtlStageFinanceDax } = require('../../../../app/retention/stage/remove-etl-stage-finance-dax')

jest.mock('../../../../app/data', () => ({
  etlStageFinanceDax: {
    destroy: jest.fn()
  },
  Sequelize: {
    Op: {
      in: 'in'
    }
  }
}))

describe('removeEtlStageFinanceDax', () => {
  const paymentRefs = ['PR-100', 'PR-101', 'PR-102']
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlStageFinanceDax.destroy with correct parameters using Sequelize.Op.in', async () => {
    db.etlStageFinanceDax.destroy.mockResolvedValue()

    await removeEtlStageFinanceDax(paymentRefs, transaction)

    expect(db.etlStageFinanceDax.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlStageFinanceDax.destroy).toHaveBeenCalledWith({
      where: {
        paymentRef: {
          [db.Sequelize.Op.in]: paymentRefs
        }
      },
      transaction
    })
  })

  test('propagates error when db.etlStageFinanceDax.destroy rejects', async () => {
    const error = new Error('DB destroy error')
    db.etlStageFinanceDax.destroy.mockRejectedValue(error)

    await expect(removeEtlStageFinanceDax(paymentRefs, transaction)).rejects.toThrow('DB destroy error')
  })
})
