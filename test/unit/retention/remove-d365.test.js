const db = require('../../../app/data')
const { removeD365 } = require('../../../app/retention/remove-d365')

jest.mock('../../../app/data', () => ({
  d365: {
    destroy: jest.fn()
  },
  Sequelize: {
    Op: {
      in: 'in'
    }
  }
}))

describe('removeD365', () => {
  const calculationIds = [101, 102, 103]
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.d365.destroy with correct parameters using Sequelize.Op.in', async () => {
    db.d365.destroy.mockResolvedValue()

    await removeD365(calculationIds, transaction)

    expect(db.d365.destroy).toHaveBeenCalledTimes(1)
    expect(db.d365.destroy).toHaveBeenCalledWith({
      where: {
        calculationId: {
          [db.Sequelize.Op.in]: calculationIds
        }
      },
      transaction
    })
  })

  test('propagates error when db.d365.destroy rejects', async () => {
    const error = new Error('DB destroy error')
    db.d365.destroy.mockRejectedValue(error)

    await expect(removeD365(calculationIds, transaction)).rejects.toThrow('DB destroy error')
  })
})
