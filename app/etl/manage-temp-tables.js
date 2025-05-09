const { executeQuery } = require('./load-scripts/load-interm-utils')

const intermTablesToCopy = [
  'etlIntermFinanceDax',
  'etlIntermCalcOrg',
  'etlIntermOrg',
  'etlIntermApplicationClaim',
  'etlIntermApplicationContract',
  'etlIntermApplicationPayment'
]

const createTempTables = async () => {
  for (const tableName of intermTablesToCopy) {
    await executeQuery(`DROP TABLE IF EXISTS "${tableName}Temp";`)
    await executeQuery(`CREATE TEMP TABLE "${tableName}Temp" AS SELECT * FROM "${tableName}";`)
  }
}

const restoreIntermTablesFromTemp = async () => {
  for (const tableName of intermTablesToCopy) {
    await executeQuery(`DELETE FROM "${tableName}";`)
    await executeQuery(`INSERT INTO "${tableName}" SELECT * FROM "${tableName}Temp";`)
  }
}

const clearTempTables = async () => {
  for (const tableName of intermTablesToCopy) {
    await executeQuery(`DROP TABLE IF EXISTS "${tableName}Temp";`)
  }
}

module.exports = {
  createTempTables,
  restoreIntermTablesFromTemp,
  clearTempTables
}
