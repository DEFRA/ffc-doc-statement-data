const sourceColumnNames = require('../../constants/source-column-names')
const targetColumnNames = require('../../constants/target-column-names')
const config = require('../../config')
const { cssOptions } = require('../../constants/tables')
const { downloadAndProcessFile, dateTimeFormat } = require('./stage-utils')
const { VARCHAR, DATE, NUMBER } = require('../../constants/target-column-types')

const columns = [
  sourceColumnNames.CHANGE_TYPE,
  sourceColumnNames.CHANGE_TIME,
  sourceColumnNames.OPTION_TYPE_ID,
  sourceColumnNames.OPTION_DESCRIPTION,
  sourceColumnNames.OPTION_LONG_DESCRIPTION,
  sourceColumnNames.DURATION,
  sourceColumnNames.OPTION_CODE,
  sourceColumnNames.CONTRACT_TYPE_ID,
  sourceColumnNames.START_DT,
  sourceColumnNames.END_DT,
  sourceColumnNames.GROUP_ID
]

const mapping = [
  { column: sourceColumnNames.CHANGE_TYPE, targetColumn: targetColumnNames.changeType, targetType: VARCHAR },
  { column: sourceColumnNames.CHANGE_TIME, targetColumn: targetColumnNames.changeTime, targetType: DATE, format: dateTimeFormat },
  { column: sourceColumnNames.OPTION_TYPE_ID, targetColumn: targetColumnNames.optionTypeId, targetType: NUMBER },
  { column: sourceColumnNames.OPTION_DESCRIPTION, targetColumn: targetColumnNames.optionDescription, targetType: VARCHAR },
  { column: sourceColumnNames.OPTION_LONG_DESCRIPTION, targetColumn: targetColumnNames.optionLongDescription, targetType: VARCHAR },
  { column: sourceColumnNames.DURATION, targetColumn: targetColumnNames.duration, targetType: NUMBER },
  { column: sourceColumnNames.OPTION_CODE, targetColumn: targetColumnNames.optionCode, targetType: VARCHAR },
  { column: sourceColumnNames.CONTRACT_TYPE_ID, targetColumn: targetColumnNames.contractTypeId, targetType: NUMBER },
  { column: sourceColumnNames.START_DT, targetColumn: targetColumnNames.startDt, targetType: DATE, format: dateTimeFormat },
  { column: sourceColumnNames.END_DT, targetColumn: targetColumnNames.endDt, targetType: DATE, format: dateTimeFormat },
  { column: sourceColumnNames.GROUP_ID, targetColumn: targetColumnNames.groupId, targetType: VARCHAR }
]

let excludedFields = []
if (config.etlConfig.excludeCalculationData) {
  excludedFields = [
    targetColumnNames.contractTypeId,
    targetColumnNames.duration,
    targetColumnNames.groupId,
    targetColumnNames.optionCode,
    targetColumnNames.optionDescription,
    targetColumnNames.optionLongDescription,
    targetColumnNames.optionTypeId
  ]
}

const stageCSSOptions = async () => {
  return downloadAndProcessFile('cssOptions', cssOptions, columns, mapping, excludedFields)
}

module.exports = {
  stageCSSOptions
}
