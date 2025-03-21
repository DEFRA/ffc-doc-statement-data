const sourceColumnNames = require('../../constants/source-column-names')
const targetColumnNames = require('../../constants/target-column-names')
const { VARCHAR, DATE, NUMBER } = require('../../constants/target-column-types')
const { appCalcResultsDelinkPayments } = require('../../constants/tables')
const { downloadAndProcessFile, monthDayYearDateTimeFormat } = require('./stage-utils')

const stageAppCalcResultsDelinkPayments = async () => {
  const format = monthDayYearDateTimeFormat
  const folder = 'appCalculationResultsDelinkPayments'

  const columns = [
    sourceColumnNames.CHANGE_TYPE,
    sourceColumnNames.CHANGE_TIME,
    sourceColumnNames.CALCULATION_ID,
    sourceColumnNames.VARIABLE_NAME,
    sourceColumnNames.PROG_LINE,
    sourceColumnNames.VALUE
  ]

  const mapping = [
    { column: sourceColumnNames.CHANGE_TYPE, targetColumn: targetColumnNames.changeType, targetType: VARCHAR },
    { column: sourceColumnNames.CHANGE_TIME, targetColumn: targetColumnNames.changeTime, targetType: DATE, format },
    { column: sourceColumnNames.CALCULATION_ID, targetColumn: targetColumnNames.calculationId, targetType: NUMBER },
    { column: sourceColumnNames.VARIABLE_NAME, targetColumn: targetColumnNames.variableName, targetType: VARCHAR },
    { column: sourceColumnNames.PROG_LINE, targetColumn: targetColumnNames.progLine, targetType: NUMBER },
    { column: sourceColumnNames.VALUE, targetColumn: targetColumnNames.value, targetType: VARCHAR }
  ]

  return downloadAndProcessFile(folder, appCalcResultsDelinkPayments, columns, mapping)
}

module.exports = {
  stageAppCalcResultsDelinkPayments
}
