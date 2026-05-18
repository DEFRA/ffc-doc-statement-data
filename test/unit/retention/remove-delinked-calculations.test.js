const db = require('../../../app/data')
const { removeDelinkedCalculations } = require('../../../app/retention/remove-delinked-calculations')

jest.mock('../../../app/data', () => ({
  delinkedCalculation: {
    destroy: jest.fn()
  },
  Sequelize: {
    Op: {
      in: 'in'
    }
  }
}))

describe('removeDelinkedCalculations', () => {
  const calculationIds = [201, 202, 203]
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.delinkedCalculation.destroy with correct parameters using Sequelize.Op.in', async () => {
    db.delinkedCalculation.destroy.mockResolvedValue()

    await removeDelinkedCalculations(calculationIds, transaction)

    expect(db.delinkedCalculation.destroy).toHaveBeenCalledTimes(1)
    expect(db.delinkedCalculation.destroy).toHaveBeenCalledWith({
      where: {
        calculationId: {
          [db.Sequelize.Op.in]: calculationIds
        }
      },
      transaction
    })
  })

  test('propagates error when db.delinkedCalculation.destroy rejects', async () => {
    const error = new Error('DB destroy error')
    db.delinkedCalculation.destroy.mockRejectedValue(error)

    await expect(removeDelinkedCalculations(calculationIds, transaction)).rejects.toThrow('DB destroy error')
  })
})
