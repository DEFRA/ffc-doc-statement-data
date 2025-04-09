const { etlConfig } = require('../../../../app/config')
const db = require('../../../../app/data')
const { loadIntermFinanceDAX } = require('../../../../app/etl/load-scripts/load-interm-finance-dax')

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

let mockTransaction
describe('loadIntermFinanceDAX', () => {
  const startDate = '2023-01-01'

  beforeEach(() => {
    mockTransaction = {}
    db.etlStageLog.findAll.mockClear()
    db.sequelize.query.mockClear()
  })

  test('should throw an error if multiple records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ file: 'Finance_Dax/export.csv', idFrom: 1, idTo: 2 }, { file: 'Finance_Dax/export.csv', idFrom: 3, idTo: 4 }])

    await expect(loadIntermFinanceDAX(startDate, mockTransaction)).rejects.toThrow(
      `Multiple records found for updates to ${etlConfig.financeDAX.folder}, expected only one`
    )
  })

  test('should return if no records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([])

    await expect(loadIntermFinanceDAX(startDate, mockTransaction)).resolves.toBeUndefined()
    expect(db.sequelize.query).not.toHaveBeenCalled()
  })

  test('should call sequelize.query with correct SQL and parameters', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ file: 'Finance_Dax/export.csv', idFrom: 1, idTo: 2 }])

    await loadIntermFinanceDAX(startDate, mockTransaction)

    expect(db.sequelize.query).toMatchSnapshot()
  })

  test('should handle errors thrown by sequelize.query', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ file: 'Finance_Dax/export.csv', idFrom: 1, idTo: 2 }])
    db.sequelize.query.mockRejectedValue(new Error('Query failed'))

    await expect(loadIntermFinanceDAX(startDate, mockTransaction)).rejects.toThrow('Query failed')
  })
})
