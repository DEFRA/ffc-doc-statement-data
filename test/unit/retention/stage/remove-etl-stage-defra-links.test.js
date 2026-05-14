const db = require('../../../../app/data')
const { removeEtlStageDefraLinks } = require('../../../../app/retention/stage/remove-etl-stage-defra-links')

jest.mock('../../../../app/data', () => ({
  etlStageDefraLinks: {
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

  test('calls db.etlStageDefraLinks.destroy with correct parameters using Sequelize.Op.in', async () => {
    db.etlStageDefraLinks.destroy.mockResolvedValue()

    await removeEtlStageDefraLinks(subjectIds, transaction)

    expect(db.etlStageDefraLinks.destroy).toHaveBeenCalledTimes(1)
    expect(db.etlStageDefraLinks.destroy).toHaveBeenCalledWith({
      where: {
        subjectId: {
          [db.Sequelize.Op.in]: subjectIds
        }
      },
      transaction
    })
  })

  test('propagates error when db.etlStageDefraLinks.destroy rejects', async () => {
    const error = new Error('DB destroy error')
    db.etlStageDefraLinks.destroy.mockRejectedValue(error)

    await expect(removeEtlStageDefraLinks(subjectIds, transaction)).rejects.toThrow('DB destroy error')
  })
})
