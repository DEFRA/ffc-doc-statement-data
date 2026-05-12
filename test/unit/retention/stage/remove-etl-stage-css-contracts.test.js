const db = require('../../../../app/data')
const { removeEtlStageCssContracts } = require('../../../../app/retention/stage/remove-etl-stage-css-contracts')

jest.mock('../../../../app/data', () => ({
  etlStageCssContracts: {
    destroy: jest.fn()
  },
  Sequelize: {
    Op: {
      in: 'in'
    }
  }
}))

describe('removeEtlStageCssContracts', () => {
  const contractIds = [401, 402, 403]
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlStageCssContracts.destroy with correct parameters using Sequelize.Op.in', async () => {
    db.etlStageCssContracts.destroy.mockResolvedValue()

    await removeEtlStageCssContracts(contractIds, transaction)

    expect(db.etlStageCssContracts.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlStageCssContracts.destroy).toHaveBeenCalledWith({
      where: {
        contractId: {
          [db.Sequelize.Op.in]: contractIds
        }
      },
      transaction
    })
  })

  test('propagates error when db.etlStageCssContracts.destroy rejects', async () => {
    const error = new Error('DB destroy error')
    db.etlStageCssContracts.destroy.mockRejectedValue(error)

    await expect(removeEtlStageCssContracts(contractIds, transaction)).rejects.toThrow('DB destroy error')
  })
})
