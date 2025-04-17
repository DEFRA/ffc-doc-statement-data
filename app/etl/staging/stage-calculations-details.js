const sourceColumnNames = require('../../constants/source-column-names')
const targetColumnNames = require('../../constants/target-column-names')
const { calculationsDetails } = require('../../constants/tables')
const { downloadAndProcessFile, dateTimeFormat, monthDayYearDateTimeFormat } = require('./stage-utils')

const stageCalculationDetails = async (monthDayFormat = false, folder = 'calculationsDetails') => {
  const format = monthDayFormat ? monthDayYearDateTimeFormat : dateTimeFormat
  const { VARCHAR, DATE, NUMBER } = require('../../constants/target-column-types')

  const columns = [
    sourceColumnNames.CHANGE_TYPE,
    sourceColumnNames.CHANGE_TIME,
    sourceColumnNames.APPLICATION_ID,
    sourceColumnNames.ID_CLC_HEADER,
    sourceColumnNames.CALCULATION_ID,
    sourceColumnNames.CALCULATION_DT,
    sourceColumnNames.RANKED
  ]

  const mapping = [
    { column: sourceColumnNames.CHANGE_TYPE, targetColumn: targetColumnNames.changeType, targetType: VARCHAR },
    { column: sourceColumnNames.CHANGE_TIME, targetColumn: targetColumnNames.changeTime, targetType: DATE, format },
    { column: sourceColumnNames.APPLICATION_ID, targetColumn: targetColumnNames.applicationId, targetType: NUMBER },
    { column: sourceColumnNames.ID_CLC_HEADER, targetColumn: targetColumnNames.idClcHeader, targetType: NUMBER },
    { column: sourceColumnNames.CALCULATION_ID, targetColumn: targetColumnNames.calculationId, targetType: NUMBER },
    { column: sourceColumnNames.CALCULATION_DT, targetColumn: targetColumnNames.calculationDt, targetType: DATE, format },
    { column: sourceColumnNames.RANKED, targetColumn: targetColumnNames.ranked, targetType: NUMBER }
  ]

  return downloadAndProcessFile(folder, calculationsDetails, columns, mapping)
}

const stageCalculationDetailsDelinked = async () => {
  return stageCalculationDetails(true, 'calculationsDetailsDelinked')
}

module.exports = {
  stageCalculationDetails,
  stageCalculationDetailsDelinked
}
