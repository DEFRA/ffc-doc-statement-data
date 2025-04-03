const { storageConfig } = require('../../../../app/config')
const db = require('../../../../app/data')
const { loadIntermAppCalcResultsDelinkPayment } = require('../../../../app/etl/load-scripts/load-interm-app-calc-results-delink-payment')

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

describe('loadIntermAppCalcResultsDelinkPayment', () => {
  const startDate = '2023-01-01'
  const transaction = {}

  beforeEach(() => {
    db.etlStageLog.findAll.mockClear()
    db.sequelize.query.mockClear()
  })

  test('should throw an error if multiple records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ id_from: 1, id_to: 2 }, { id_from: 3, id_to: 4 }])

    await expect(loadIntermAppCalcResultsDelinkPayment(startDate, transaction)).rejects.toThrow(
      `Multiple records found for updates to ${storageConfig.appCalculationResultsDelinkPayments.folder}, expected only one`
    )
  })

  test('should return if no records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([])

    await expect(loadIntermAppCalcResultsDelinkPayment(startDate, transaction)).resolves.toBeUndefined()
    expect(db.sequelize.query).not.toHaveBeenCalled()
  })

  test('should call sequelize.query with correct SQL and parameters', async () => {
    const file = `${storageConfig.appCalculationResultsDelinkPayments.folder}/export.csv`
    db.etlStageLog.findAll.mockResolvedValue([{ idFrom: 1, idTo: 2, file }])

    await loadIntermAppCalcResultsDelinkPayment(startDate, transaction)

    expect(db.sequelize.query).toMatchSnapshot()
  })

  test('should handle errors thrown by sequelize.query', async () => {
    const file = `${storageConfig.appCalculationResultsDelinkPayments.folder}/export.csv`
    db.etlStageLog.findAll.mockResolvedValue([{ idFrom: 1, idTo: 2, file }])
    db.sequelize.query.mockRejectedValue(new Error('Query failed'))

    await expect(loadIntermAppCalcResultsDelinkPayment(startDate, transaction)).rejects.toThrow('Query failed')
  })
})
