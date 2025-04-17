const { etlConfig } = require('../../../../app/config')
const db = require('../../../../app/data')
const { loadIntermCalcOrg } = require('../../../../app/etl/load-scripts/load-interm-calc-org')

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

describe('loadIntermCalcOrg', () => {
  const startDate = '2023-01-01'

  beforeEach(() => {
    db.etlStageLog.findAll.mockClear()
    db.sequelize.query.mockClear()
  })

  test('should throw an error if multiple records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ file: 'Apps_Payment_Notification/export.csv', idFrom: 1, idTo: 2 }, { file: 'Apps_Payment_Notification/export.csv', idFrom: 3, idTo: 4 }])

    await expect(loadIntermCalcOrg(startDate)).rejects.toThrow(
      `Multiple records found for updates to ${etlConfig.appsPaymentNotification.folder}, expected only one`
    )
  })

  test('should return if no records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([])

    await expect(loadIntermCalcOrg(startDate)).resolves.toBeUndefined()
    expect(db.sequelize.query).not.toHaveBeenCalled()
  })

  test('should call sequelize.query with correct SQL and parameters', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ file: 'Apps_Payment_Notification/export.csv', idFrom: 1, idTo: 2 }])

    await loadIntermCalcOrg(startDate)

    expect(db.sequelize.query).toMatchSnapshot()
  })
})
