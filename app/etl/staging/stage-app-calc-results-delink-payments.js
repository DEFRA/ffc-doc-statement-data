const sourceColumnNames = require('../../constants/source-column-names')
const targetColumnNames = require('../../constants/target-column-names')
const { VARCHAR, DATE } = require('../../constants/target-column-types')
const { appCalcResultsDelinkPayments } = require('../../constants/tables')
const { downloadAndProcessFile, monthDayYearDateTimeFormat } = require('./stage-utils')

const stageAppCalcResultsDelinkPayments = async () => {
  const format = monthDayYearDateTimeFormat
  const folder = 'appCalculationResultsDelinkPayments'

  const columns = [
    sourceColumnNames.CHANGE_TYPE,
    sourceColumnNames.CHANGE_TIME, 'CALCULATION_ID', 'VARIABLE_NAME', 'PROG_LINE', 'VALUE'
  ]

  const mapping = [
    { column: sourceColumnNames.CHANGE_TYPE, targetColumn: targetColumnNames.changeType, targetType: VARCHAR },
    { column: sourceColumnNames.CHANGE_TIME, targetColumn: targetColumnNames.changeTime, targetType: DATE, format },
    { column: 'CALCULATION_ID', targetColumn: 'calculation_id', targetType: 'number' },
    { column: 'VARIABLE_NAME', targetColumn: 'variable_name', targetType: 'varchar' },
    { column: 'PROG_LINE', targetColumn: 'prog_line', targetType: 'number' },
    { column: 'VALUE', targetColumn: 'value', targetType: 'varchar' }
  ]

  return downloadAndProcessFile(folder, appCalcResultsDelinkPayments, columns, mapping)
}

module.exports = {
  stageAppCalcResultsDelinkPayments
}
