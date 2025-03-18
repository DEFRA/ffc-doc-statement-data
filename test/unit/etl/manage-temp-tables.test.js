const { executeQuery } = require('../../../app/etl/load-scripts/load-interm-utils')
const { createTempTables, restoreIntermTablesFromTemp, clearTempTables } = require('../../../app/etl/manage-temp-tables')

jest.mock('../../../app/etl/load-scripts/load-interm-utils')

const intermTablesToCopy = [
  'etlIntermFinanceDax',
  'etlIntermCalcOrg',
  'etlIntermOrg',
  'etlIntermApplicationClaim',
  'etlIntermApplicationContract',
  'etlIntermApplicationPayment'
]

describe('ETL Interm Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createTempTables', () => {
    test('should drop existing temp tables and create new temp tables', async () => {
      await createTempTables()

      for (const tableName of intermTablesToCopy) {
        expect(executeQuery).toHaveBeenCalledWith(`DROP TABLE IF EXISTS ${tableName}Temp;`)
        expect(executeQuery).toHaveBeenCalledWith(`CREATE TEMP TABLE ${tableName}Temp AS SELECT * FROM ${tableName};`)
      }

      expect(executeQuery).toHaveBeenCalledTimes(intermTablesToCopy.length * 2)
    })
  })

  describe('restoreIntermTablesFromTemp', () => {
    test('should delete existing records and restore from temp tables', async () => {
      await restoreIntermTablesFromTemp()

      for (const tableName of intermTablesToCopy) {
        expect(executeQuery).toHaveBeenCalledWith(`DELETE FROM ${tableName};`)
        expect(executeQuery).toHaveBeenCalledWith(`INSERT INTO ${tableName} SELECT * FROM ${tableName}Temp;`)
      }

      expect(executeQuery).toHaveBeenCalledTimes(intermTablesToCopy.length * 2)
    })
  })

  describe('clearTempTables', () => {
    test('should drop temp tables', async () => {
      await clearTempTables()

      for (const tableName of intermTablesToCopy) {
        expect(executeQuery).toHaveBeenCalledWith(`DROP TABLE IF EXISTS ${tableName}Temp;`)
      }

      expect(executeQuery).toHaveBeenCalledTimes(intermTablesToCopy.length)
    })
  })
})
