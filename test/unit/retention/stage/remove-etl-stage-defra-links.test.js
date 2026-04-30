const db = require('../../../../app/data')
const { removeEtlStageDefraLinks } = require('../../../../app/retention/stage/remove-etl-stage-defra-links')

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

describe('removeEtlStageDefraLinks', () => {
  const subjectIds = ['SUBJ-1', 'SUBJ-2', 'SUBJ-3']
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('calls db.etlStageCssContracts.destroy with correct parameters using Sequelize.Op.in', async () => {
    db.etlStageCssContracts.destroy.mockResolvedValue()

    await removeEtlStageDefraLinks(subjectIds, transaction)

    expect(db.etlStageCssContracts.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlStageCssContracts.destroy).toHaveBeenCalledWith({
      where: {
        subjectId: {
          [db.Sequelize.Op.in]: subjectIds
        }
      },
      transaction
    })
  })

  test('propagates error when db.etlStageCssContracts.destroy rejects', async () => {
    const error = new Error('DB destroy error')
    db.etlStageCssContracts.destroy.mockRejectedValue(error)

    await expect(removeEtlStageDefraLinks(subjectIds, transaction)).rejects.toThrow('DB destroy error')
  })
})
