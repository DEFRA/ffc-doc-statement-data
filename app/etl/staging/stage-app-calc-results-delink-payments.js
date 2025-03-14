const { appCalcResultsDelinkPayments } = require('../../constants/tables')
const { downloadAndProcessFile, monthDayYearDateTimeFormat } = require('./stage-utils')

const stageAppCalcResultsDelinkPayments = async () => {
  const format = monthDayYearDateTimeFormat
  const folder = 'appCalculationResultsDelinkPayments'

  const columns = [
    'CHANGE_TYPE', 'CHANGE_TIME', 'CALCULATION_ID', 'VARIABLE_NAME', 'PROG_LINE', 'VALUE'
  ]

  const mapping = [
    { column: 'CHANGE_TYPE', targetColumn: 'change_type', targetType: 'varchar' },
    { column: 'CHANGE_TIME', targetColumn: 'change_time', targetType: 'date', format },
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
