const sourceColumnNames = require('../../constants/source-column-names')
const targetColumnNames = require('../../constants/target-column-names')
const config = require('../../config')
const { defraLinks } = require('../../constants/tables')
const { downloadAndProcessFile, dateTimeFormat } = require('./stage-utils')
const { VARCHAR, DATE, NUMBER } = require('../../constants/target-column-types')

const columns = [
  sourceColumnNames.CHANGE_TYPE,
  sourceColumnNames.CHANGE_TIME,
  sourceColumnNames.SUBJECT_ID,
  sourceColumnNames.DEFRA_ID,
  sourceColumnNames.DEFRA_TYPE,
  sourceColumnNames.MDM_ID
]

const mapping = [
  { column: sourceColumnNames.CHANGE_TYPE, targetColumn: targetColumnNames.changeType, targetType: VARCHAR },
  { column: sourceColumnNames.CHANGE_TIME, targetColumn: targetColumnNames.changeTime, targetType: DATE, format: dateTimeFormat },
  { column: sourceColumnNames.SUBJECT_ID, targetColumn: targetColumnNames.subjectId, targetType: NUMBER },
  { column: sourceColumnNames.DEFRA_ID, targetColumn: targetColumnNames.defraId, targetType: VARCHAR },
  { column: sourceColumnNames.DEFRA_TYPE, targetColumn: targetColumnNames.defraType, targetType: VARCHAR },
  { column: sourceColumnNames.MDM_ID, targetColumn: targetColumnNames.mdmId, targetType: NUMBER }
]

let excludedFields = []
if (config.etlConfig.excludeCalculationData) {
  excludedFields = [
    targetColumnNames.defraId,
    targetColumnNames.defraType,
    targetColumnNames.mdmId
  ]
}

const stageDefraLinks = async () => {
  return downloadAndProcessFile('defraLinks', defraLinks, columns, mapping, excludedFields)
}

module.exports = {
  stageDefraLinks
}
