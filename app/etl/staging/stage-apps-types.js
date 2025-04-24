const sourceColumnNames = require('../../constants/source-column-names')
const targetColumnNames = require('../../constants/target-column-names')
const config = require('../../config')
const { appsTypes } = require('../../constants/tables')
const { VARCHAR, DATE, NUMBER } = require('../../constants/target-column-types')
const { downloadAndProcessFile, dateTimeFormat, monthDayYearDateTimeFormat } = require('./stage-utils')

const stageAppsTypes = async (monthDayFormat = false, folder = 'appsTypes') => {
  const format = monthDayFormat ? monthDayYearDateTimeFormat : dateTimeFormat

  const columns = [
    sourceColumnNames.CHANGE_TYPE,
    sourceColumnNames.CHANGE_TIME,
    sourceColumnNames.APP_TYPE_ID,
    sourceColumnNames.SECTOR_P_CODE,
    sourceColumnNames.SECTOR_S_CODE,
    sourceColumnNames.SHORT_DESCRIPTION,
    sourceColumnNames.EXT_DESCRIPTION,
    sourceColumnNames.YEAR,
    sourceColumnNames.WIN_OPEN_DATE,
    sourceColumnNames.WIN_CLOSE_DATE   
  ]

  const mapping = [
    { column: sourceColumnNames.CHANGE_TYPE, targetColumn: targetColumnNames.changeType, targetType: VARCHAR },
    { column: sourceColumnNames.CHANGE_TIME, targetColumn: targetColumnNames.changeTime, targetType: DATE, format },
    { column: sourceColumnNames.APP_TYPE_ID, targetColumn: targetColumnNames.appTypeId, targetType: NUMBER },
    { column: sourceColumnNames.SECTOR_P_CODE, targetColumn: targetColumnNames.sectorPCode, targetType: VARCHAR },
    { column: sourceColumnNames.SECTOR_S_CODE, targetColumn: targetColumnNames.sectorSCode, targetType: VARCHAR },
    { column: sourceColumnNames.SHORT_DESCRIPTION, targetColumn: targetColumnNames.shortDescription, targetType: VARCHAR },
    { column: sourceColumnNames.EXT_DESCRIPTION, targetColumn: targetColumnNames.extDescription, targetType: VARCHAR },
    { column: sourceColumnNames.YEAR, targetColumn: targetColumnNames.year, targetType: NUMBER },
    { column: sourceColumnNames.WIN_OPEN_DATE, targetColumn: targetColumnNames.winOpenDate, targetType: DATE, format },
    { column: sourceColumnNames.WIN_CLOSE_DATE, targetColumn: targetColumnNames.winCloseDate, targetType: DATE, format }
  ]

  let excludedFields = []
  if (config.etlConfig.excludeCalculationData) {
    excludedFields = [
      targetColumnNames.appTypeId,
      targetColumnNames.extDescription,
      targetColumnNames.sectorPCode,
      targetColumnNames.sectorSCode,
      targetColumnNames.shortDescription,
      targetColumnNames.winCloseDate,
      targetColumnNames.winOpenDate,
      targetColumnNames.year
    ]
  }

  return downloadAndProcessFile(folder, appsTypes, columns, mapping, excludedFields)
}

const stageAppsTypesDelinked = async () => {
  return stageAppsTypes(true, 'appsTypesDelinked')
}

module.exports = {
  stageAppsTypes,
  stageAppsTypesDelinked
}
