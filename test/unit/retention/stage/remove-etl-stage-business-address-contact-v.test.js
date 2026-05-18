const db = require('../../../../app/data')
const { removeEtlStageBusinessAddressContactV } = require('../../../../app/retention/stage/remove-etl-stage-business-address-contact-v')

jest.mock('../../../../app/data', () => ({
  etlStageBusinessAddressContactV: {
    destroy: jest.fn()
  },
  Sequelize: {
    Op: {
      in: 'in'
    }
  }
}))

describe('removeEtlStageBusinessAddressContactV', () => {
  const sbis = [1001, 1002, 1003]
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlStageBusinessAddressContactV.destroy with correct parameters using Sequelize.Op.in', async () => {
    db.etlStageBusinessAddressContactV.destroy.mockResolvedValue()

    await removeEtlStageBusinessAddressContactV(sbis, transaction)

    expect(db.etlStageBusinessAddressContactV.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlStageBusinessAddressContactV.destroy).toHaveBeenCalledWith({
      where: {
        sbi: {
          [db.Sequelize.Op.in]: sbis
        }
      },
      transaction
    })
  })

  test('propagates error when db.etlStageBusinessAddressContactV.destroy rejects', async () => {
    const error = new Error('DB destroy error')
    db.etlStageBusinessAddressContactV.destroy.mockRejectedValue(error)

    await expect(removeEtlStageBusinessAddressContactV(sbis, transaction)).rejects.toThrow('DB destroy error')
  })
})
