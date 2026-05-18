const db = require('../../../../app/data')
const { removeEtlStageOrganisation } = require('../../../../app/retention/stage/remove-etl-stage-organisation')

jest.mock('../../../../app/data', () => ({
  etlStageOrganisation: {
    destroy: jest.fn()
  },
  Sequelize: {
    Op: {
      in: 'in'
    }
  }
}))

describe('removeEtlStageOrganisation', () => {
  const sbis = [5001, 5002, 5003]
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlStageOrganisation.destroy with correct parameters using Sequelize.Op.in', async () => {
    db.etlStageOrganisation.destroy.mockResolvedValue()

    await removeEtlStageOrganisation(sbis, transaction)

    expect(db.etlStageOrganisation.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlStageOrganisation.destroy).toHaveBeenCalledWith({
      where: {
        sbi: {
          [db.Sequelize.Op.in]: sbis
        }
      },
      transaction
    })
  })

  test('propagates error when db.etlStageOrganisation.destroy rejects', async () => {
    const error = new Error('DB destroy error')
    db.etlStageOrganisation.destroy.mockRejectedValue(error)

    await expect(removeEtlStageOrganisation(sbis, transaction)).rejects.toThrow('DB destroy error')
  })
})
