const sourceColumnNames = require('../../constants/source-column-names')
const targetColumnNames = require('../../constants/target-column-names')
const { cssContractApplications } = require('../../constants/tables')
const { downloadAndProcessFile, dateTimeFormat } = require('./stage-utils')
const { VARCHAR, DATE, NUMBER } = require('../../constants/target-column-types')

const stageCSSContractApplications = async () => {
  const columns = [
    sourceColumnNames.CHANGE_TYPE,
    sourceColumnNames.CHANGE_TIME,
    sourceColumnNames.PKID,
    sourceColumnNames.INSERT_DT,
    sourceColumnNames.DELETE_DT,
    sourceColumnNames.CONTRACT_ID,
    sourceColumnNames.APPLICATION_ID,
    sourceColumnNames.TYPE_P_CODE,
    sourceColumnNames.TYPE_S_CODE,
    sourceColumnNames.DATA_SOURCE_P_CODE,
    sourceColumnNames.DATA_SOURCE_S_CODE,
    sourceColumnNames.START_DT,
    sourceColumnNames.END_DT,
    sourceColumnNames.VALID_START_FLAG,
    sourceColumnNames.VALID_END_FLAG,
    sourceColumnNames.START_ACT_ID,
    sourceColumnNames.END_ACT_ID,
    sourceColumnNames.LAST_UPDATE_DT,
    sourceColumnNames.USER_FLD
  ]

  const mapping = [
    { column: sourceColumnNames.CHANGE_TYPE, targetColumn: targetColumnNames.changeType, targetType: VARCHAR },
    { column: sourceColumnNames.CHANGE_TIME, targetColumn: targetColumnNames.changeTime, targetType: DATE, format: dateTimeFormat },
    { column: sourceColumnNames.PKID, targetColumn: targetColumnNames.pkid, targetType: NUMBER },
    { column: sourceColumnNames.INSERT_DT, targetColumn: targetColumnNames.insertDt, targetType: DATE, format: dateTimeFormat },
    { column: sourceColumnNames.DELETE_DT, targetColumn: targetColumnNames.deleteDt, targetType: DATE, format: dateTimeFormat },
    { column: sourceColumnNames.CONTRACT_ID, targetColumn: targetColumnNames.contractId, targetType: NUMBER },
    { column: sourceColumnNames.APPLICATION_ID, targetColumn: targetColumnNames.applicationId, targetType: NUMBER },
    { column: sourceColumnNames.TYPE_P_CODE, targetColumn: targetColumnNames.typePCode, targetType: VARCHAR },
    { column: sourceColumnNames.TYPE_S_CODE, targetColumn: targetColumnNames.typeSCode, targetType: VARCHAR },
    { column: sourceColumnNames.DATA_SOURCE_P_CODE, targetColumn: targetColumnNames.dataSourcePCode, targetType: VARCHAR },
    { column: sourceColumnNames.DATA_SOURCE_S_CODE, targetColumn: targetColumnNames.dataSourceSCode, targetType: VARCHAR },
    { column: sourceColumnNames.START_DT, targetColumn: targetColumnNames.startDt, targetType: DATE, format: dateTimeFormat },
    { column: sourceColumnNames.END_DT, targetColumn: targetColumnNames.endDt, targetType: DATE, format: dateTimeFormat },
    { column: sourceColumnNames.VALID_START_FLAG, targetColumn: targetColumnNames.validStartFlag, targetType: VARCHAR },
    { column: sourceColumnNames.VALID_END_FLAG, targetColumn: targetColumnNames.validEndFlag, targetType: VARCHAR },
    { column: sourceColumnNames.START_ACT_ID, targetColumn: targetColumnNames.startActId, targetType: NUMBER },
    { column: sourceColumnNames.END_ACT_ID, targetColumn: targetColumnNames.endActId, targetType: NUMBER },
    { column: sourceColumnNames.LAST_UPDATE_DT, targetColumn: targetColumnNames.lastUpdateDt, targetType: DATE, format: dateTimeFormat },
    { column: sourceColumnNames.USER_FLD, targetColumn: targetColumnNames.userFld, targetType: VARCHAR }
  ]

  return downloadAndProcessFile('cssContractApplications', cssContractApplications, columns, mapping)
}

module.exports = {
  stageCSSContractApplications
}
