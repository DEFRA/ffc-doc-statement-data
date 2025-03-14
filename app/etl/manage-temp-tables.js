const { executeQuery } = require('./load-scripts/load-interm-utils')

const intermTablesToCopy = [
  'etl_interm_finance_dax',
  'etl_interm_calc_org',
  'etl_interm_org',
  'etl_interm_application_claim',
  'etl_interm_application_contract',
  'etl_interm_application_payment'
]

const createTempTables = async () => {
  for (const tableName of intermTablesToCopy) {
    await executeQuery(`DROP TABLE IF EXISTS ${tableName}_temp;`)
    await executeQuery(`CREATE TEMP TABLE ${tableName}_temp AS SELECT * FROM ${tableName};`)
  }
}

const restoreIntermTablesFromTemp = async () => {
  for (const tableName of intermTablesToCopy) {
    await executeQuery(`DELETE FROM ${tableName};`)
    await executeQuery(`INSERT INTO ${tableName} SELECT * FROM ${tableName}_temp;`)
  }
}

const clearTempTables = async () => {
  for (const tableName of intermTablesToCopy) {
    await executeQuery(`DROP TABLE IF EXISTS ${tableName}_temp;`)
  }
}

module.exports = {
  createTempTables,
  restoreIntermTablesFromTemp,
  clearTempTables
}
