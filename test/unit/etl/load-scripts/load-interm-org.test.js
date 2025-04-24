const { etlConfig } = require('../../../../app/config')
const db = require('../../../../app/data')
const { loadIntermOrg } = require('../../../../app/etl/load-scripts/load-interm-org')

jest.mock('../../../../app/data', () => ({
  sequelize: {
    query: jest.fn()
  },
  etlStageLog: {
    findAll: jest.fn()
  },
  Sequelize: {
    Op: {
      gt: Symbol('gt')
    }
  }
}))

describe('loadIntermOrg', () => {
  const startDate = '2023-01-01'

  beforeEach(() => {
    db.etlStageLog.findAll.mockClear()
    db.sequelize.query.mockClear()
  })

  test('should throw an error if multiple records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ file: 'Organization_SFI23/export.csv', idFrom: 1, idTo: 2 }, { file: 'Organization_SFI23/export.csv', idFrom: 3, idTo: 4 }])

    await expect(loadIntermOrg(startDate)).rejects.toThrow(
      `Multiple records found for updates to ${etlConfig.organisation.folder}, expected only one`
    )
  })

  test('should return if no records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([])

    await expect(loadIntermOrg(startDate)).resolves.toBeUndefined()
    expect(db.sequelize.query).not.toHaveBeenCalled()
  })

  test('should call sequelize.query with correct SQL and parameters', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ file: 'Organization_SFI23/export.csv', idFrom: 1, idTo: 2 }])

    await loadIntermOrg(startDate)

    expect(db.sequelize.query).toMatchSnapshot()
  })
})
