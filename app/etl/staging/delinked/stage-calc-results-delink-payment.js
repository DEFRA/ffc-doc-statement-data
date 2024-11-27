const path = require('path')
const { v4: uuidv4 } = require('uuid')
const storage = require('../../storage')
const storageConfig = require('../../config/sfi23-storage')
const { calcResultsDelinkPaymentsTable } = require('../../constants/tables')
const { runEtlProcess } = require('../run-etl-process')

const stageCalcResultsDelinkPayments = async () => {
  const file = `${storageConfig.calcResultsDelinkPayments.folder}/export.csv`
  const tempFilePath = path.join(__dirname, `calcResultsDelinkPayments-${uuidv4()}.csv`)
  await storage.downloadFile(file, tempFilePath)
  const columns = [
    'APPLICATION_CALC_RESULT_WID',
    'CALCULATION_ID',
    'VARIABLE_NAME',
    'PROG_LINE',
    'VALUE',
    'W_INSERT_DT',
    'W_UPDATE_DT',
    'ETL_PROC_WID',
    'INTEGRATION_ID'
  ]

  const mapping = [
    {
      column: 'APPLICATION_CALC_RESULT_WID',
      targetColumn: 'application_calc_result_wid',
      targetType: 'number'
    },
    {
      column: 'CALCULATION_ID',
      targetColumn: 'calculation_id',
      targetType: 'number'
    },
    {
      column: 'VARIABLE_NAME',
      targetColumn: 'variable_name',
      targetType: 'varchar'
    },
    {
      column: 'PROG_LINE',
      targetColumn: 'prog_line',
      targetType: 'number'
    },
    {
      column: 'W_INSERT_DT',
      targetColumn: 'w_insert_dt',
      targetType: 'date',
      format: 'DD-MM-YYYY HH24:MI:SS'
    },
    {
      column: 'W_UPDATE_DT',
      targetColumn: 'w_update_dt',
      targetType: 'date',
      format: 'DD-MM-YYYY HH24:MI:SS'
    },
    {
      column: 'ETL_PROC_WID',
      targetColumn: 'etl_proc_wid',
      targetType: 'number'
    },
    {
      column: 'INTEGRATION_ID',
      targetColumn: 'integration_id',
      targetType: 'varchar'
    }
  ]

  return runEtlProcess({ tempFilePath, columns, table: calcResultsDelinkPaymentsTable, mapping, file })
}

module.exports = {
  stageCalcResultsDelinkPayments
}
