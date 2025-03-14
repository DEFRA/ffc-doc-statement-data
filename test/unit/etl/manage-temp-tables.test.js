const { executeQuery } = require('../../../app/etl/load-scripts/load-interm-utils')
const { createTempTables, restoreIntermTablesFromTemp, clearTempTables } = require('../../../app/etl/manage-temp-tables')

jest.mock('../../../app/etl/load-scripts/load-interm-utils')

const intermTablesToCopy = [
  'etl_interm_finance_dax',
  'etl_interm_calc_org',
  'etl_interm_org',
  'etl_interm_application_claim',
  'etl_interm_application_contract',
  'etl_interm_application_payment'
]

describe('ETL Interm Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createTempTables', () => {
    test('should drop existing temp tables and create new temp tables', async () => {
      await createTempTables()

      for (const tableName of intermTablesToCopy) {
        expect(executeQuery).toHaveBeenCalledWith(`DROP TABLE IF EXISTS ${tableName}_temp;`)
        expect(executeQuery).toHaveBeenCalledWith(`CREATE TEMP TABLE ${tableName}_temp AS SELECT * FROM ${tableName};`)
      }

      expect(executeQuery).toHaveBeenCalledTimes(intermTablesToCopy.length * 2)
    })
  })

  describe('restoreIntermTablesFromTemp', () => {
    test('should delete existing records and restore from temp tables', async () => {
      await restoreIntermTablesFromTemp()

      for (const tableName of intermTablesToCopy) {
        expect(executeQuery).toHaveBeenCalledWith(`DELETE FROM ${tableName};`)
        expect(executeQuery).toHaveBeenCalledWith(`INSERT INTO ${tableName} SELECT * FROM ${tableName}_temp;`)
      }

      expect(executeQuery).toHaveBeenCalledTimes(intermTablesToCopy.length * 2)
    })
  })

  describe('clearTempTables', () => {
    test('should drop temp tables', async () => {
      await clearTempTables()

      for (const tableName of intermTablesToCopy) {
        expect(executeQuery).toHaveBeenCalledWith(`DROP TABLE IF EXISTS ${tableName}_temp;`)
      }

      expect(executeQuery).toHaveBeenCalledTimes(intermTablesToCopy.length)
    })
  })
})
