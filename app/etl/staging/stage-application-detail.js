const sourceColumnNames = require('../../constants/source-column-names')
const targetColumnNames = require('../../constants/target-column-names')
const config = require('../../config')
const { applicationDetail } = require('../../constants/tables')
const { VARCHAR, DATE, NUMBER } = require('../../constants/target-column-types')
const { downloadAndProcessFile, dateTimeFormat, monthDayYearDateTimeFormat } = require('./stage-utils')

const columns = [
  sourceColumnNames.CHANGE_TYPE,
  sourceColumnNames.CHANGE_TIME,
  sourceColumnNames.PKID,
  sourceColumnNames.DT_INSERT,
  sourceColumnNames.DT_DELETE,
  sourceColumnNames.SUBJECT_ID,
  sourceColumnNames.UTE_ID,
  sourceColumnNames.APPLICATION_ID,
  sourceColumnNames.APPLICATION_CODE,
  sourceColumnNames.AMENDED_APP_ID,
  sourceColumnNames.APP_TYPE_ID,
  sourceColumnNames.PROXY_ID,
  sourceColumnNames.STATUS_P_CODE,
  sourceColumnNames.STATUS_S_CODE,
  sourceColumnNames.SOURCE_P_CODE,
  sourceColumnNames.SOURCE_S_CODE,
  sourceColumnNames.DT_START,
  sourceColumnNames.DT_END,
  sourceColumnNames.VALID_START_FLG,
  sourceColumnNames.VALID_END_FLG,
  sourceColumnNames.APP_ID_START,
  sourceColumnNames.APP_ID_END,
  sourceColumnNames.DT_REC_UPDATE,
  sourceColumnNames.USER_ID
]

const getMapping = (format) => {
  return [
    { column: sourceColumnNames.CHANGE_TYPE, targetColumn: targetColumnNames.changeType, targetType: VARCHAR },
    { column: sourceColumnNames.CHANGE_TIME, targetColumn: targetColumnNames.changeTime, targetType: DATE, format },
    { column: sourceColumnNames.PKID, targetColumn: targetColumnNames.pkid, targetType: NUMBER },
    { column: sourceColumnNames.DT_INSERT, targetColumn: targetColumnNames.dtInsert, targetType: DATE, format },
    { column: sourceColumnNames.DT_DELETE, targetColumn: targetColumnNames.dtDelete, targetType: DATE, format },
    { column: sourceColumnNames.SUBJECT_ID, targetColumn: targetColumnNames.subjectId, targetType: NUMBER },
    { column: sourceColumnNames.UTE_ID, targetColumn: targetColumnNames.uteId, targetType: NUMBER },
    { column: sourceColumnNames.APPLICATION_ID, targetColumn: targetColumnNames.applicationId, targetType: NUMBER },
    { column: sourceColumnNames.APPLICATION_CODE, targetColumn: targetColumnNames.applicationCode, targetType: VARCHAR },
    { column: sourceColumnNames.AMENDED_APP_ID, targetColumn: targetColumnNames.amendedAppId, targetType: NUMBER },
    { column: sourceColumnNames.APP_TYPE_ID, targetColumn: targetColumnNames.appTypeId, targetType: NUMBER },
    { column: sourceColumnNames.PROXY_ID, targetColumn: targetColumnNames.proxyId, targetType: NUMBER },
    { column: sourceColumnNames.STATUS_P_CODE, targetColumn: targetColumnNames.statusPCode, targetType: VARCHAR },
    { column: sourceColumnNames.STATUS_S_CODE, targetColumn: targetColumnNames.statusSCode, targetType: VARCHAR },
    { column: sourceColumnNames.SOURCE_P_CODE, targetColumn: targetColumnNames.sourcePCode, targetType: VARCHAR },
    { column: sourceColumnNames.SOURCE_S_CODE, targetColumn: targetColumnNames.sourceSCode, targetType: VARCHAR },
    { column: sourceColumnNames.DT_START, targetColumn: targetColumnNames.dtStart, targetType: DATE, format },
    { column: sourceColumnNames.DT_END, targetColumn: targetColumnNames.dtEnd, targetType: DATE, format },
    { column: sourceColumnNames.VALID_START_FLG, targetColumn: targetColumnNames.validStartFlg, targetType: VARCHAR },
    { column: sourceColumnNames.VALID_END_FLG, targetColumn: targetColumnNames.validEndFlg, targetType: VARCHAR },
    { column: sourceColumnNames.APP_ID_START, targetColumn: targetColumnNames.appIdStart, targetType: NUMBER },
    { column: sourceColumnNames.APP_ID_END, targetColumn: targetColumnNames.appIdEnd, targetType: NUMBER },
    { column: sourceColumnNames.DT_REC_UPDATE, targetColumn: targetColumnNames.dtRecUpdate, targetType: DATE, format },
    { column: sourceColumnNames.USER_ID, targetColumn: targetColumnNames.userId, targetType: VARCHAR }
  ]
}

let excludedFields = []
if (config.etlConfig.excludeCalculationData) {
  excludedFields = [
    targetColumnNames.amendedAppId,
    targetColumnNames.applicationCode,
    targetColumnNames.appIdEnd,
    targetColumnNames.appIdStart,
    targetColumnNames.appTypeId,
    targetColumnNames.dtEnd,
    targetColumnNames.dtInsert,
    targetColumnNames.dtRecUpdate,
    targetColumnNames.dtStart,
    targetColumnNames.dtDelete,
    targetColumnNames.proxyId,
    targetColumnNames.sourcePCode,
    targetColumnNames.sourceSCode,
    targetColumnNames.statusPCode,
    targetColumnNames.statusSCode,
    targetColumnNames.uteId,
    targetColumnNames.userId,
    targetColumnNames.validEndFlg,
    targetColumnNames.validStartFlg
  ]
}

const stageApplicationDetails = async (monthDayFormat = false, folder = 'applicationDetail') => {
  const format = monthDayFormat ? monthDayYearDateTimeFormat : dateTimeFormat
  const mapping = getMapping(format)
  return downloadAndProcessFile(folder, applicationDetail, columns, mapping, excludedFields)
}

const stageApplicationDetailsDelinked = async () => {
  return stageApplicationDetails(true, 'applicationDetailDelinked')
}

module.exports = {
  stageApplicationDetails,
  stageApplicationDetailsDelinked
}
