const sourceColumnNames = require('../../constants/source-column-names')
const targetColumnNames = require('../../constants/target-column-names')
const { VARCHAR, DATE, NUMBER } = require('../../constants/target-column-types')
const { tdeLinkingTransferTransactions } = require('../../constants/tables')
const { downloadAndProcessFile, monthDayYearDateTimeFormat } = require('./stage-utils')

const stageTdeLinkingTransferTransactions = async () => {
  const format = monthDayYearDateTimeFormat
  const folder = 'tdeLinkingTransferTransactions'

  const columns = [
    sourceColumnNames.CHANGE_TYPE,
    sourceColumnNames.CHANGE_TIME, 
    sourceColumnNames.TRANSFEROR_SBI, 
    sourceColumnNames.TRANSFEROR_CUAA, 
    sourceColumnNames.TRANSFEROR_PK_CUAA, 
    sourceColumnNames.TRANSFEREE_SBI,
    sourceColumnNames.TRANSFEREE_CUAA, 
    sourceColumnNames.TRANSFEREE_PK_CUAA, 
    sourceColumnNames.TOTAL_AMOUNT_TRANSFERRED, 
    sourceColumnNames.TRANSFER_AMOUNT, 
    sourceColumnNames.TRANSFER_AMOUNT_TRANS_IN,
    sourceColumnNames.DT_INSERT, 
    sourceColumnNames.DT_DELETE, 
    sourceColumnNames.DATE_OF_TRANSFER, 
    sourceColumnNames.STATUS_P_CODE, 
    sourceColumnNames.STATUS_S_CODE, 
    sourceColumnNames.TRANSFER_APPLICATION_ID, 
    sourceColumnNames.USER_INSERT, 
    sourceColumnNames.USER_DELETE,
    sourceColumnNames.DT_UPDATE, 
    sourceColumnNames.DATA_SOURCE_P_CODE, 
    sourceColumnNames.DATA_SOURCE_S_CODE
];

const mapping = [
  { column: sourceColumnNames.CHANGE_TYPE, targetColumn: targetColumnNames.changeType, targetType: VARCHAR },
  { column: sourceColumnNames.CHANGE_TIME, targetColumn: targetColumnNames.changeTime, targetType: DATE, format },
  { column: sourceColumnNames.TRANSFEROR_SBI, targetColumn: targetColumnNames.transferorSbi, targetType: VARCHAR },
  { column: sourceColumnNames.TRANSFEROR_CUAA, targetColumn: targetColumnNames.transferorCuaa, targetType: VARCHAR },
  { column: sourceColumnNames.TRANSFEROR_PK_CUAA, targetColumn: targetColumnNames.transferorPkCuaa, targetType: VARCHAR },
  { column: sourceColumnNames.TRANSFEREE_SBI, targetColumn: targetColumnNames.transfereeSbi, targetType: VARCHAR },
  { column: sourceColumnNames.TRANSFEREE_CUAA, targetColumn: targetColumnNames.transfereeCuaa, targetType: VARCHAR },
  { column: sourceColumnNames.TRANSFEREE_PK_CUAA, targetColumn: targetColumnNames.transfereePkCuaa, targetType: VARCHAR },
  { column: sourceColumnNames.TOTAL_AMOUNT_TRANSFERRED, targetColumn: targetColumnNames.totalAmountTransferred, targetType: NUMBER },
  { column: sourceColumnNames.TRANSFER_AMOUNT, targetColumn: targetColumnNames.transferAmount, targetType: NUMBER },
  { column: sourceColumnNames.TRANSFER_AMOUNT_TRANS_IN, targetColumn: targetColumnNames.transferAmountTransIn, targetType: NUMBER },
  { column: sourceColumnNames.DT_INSERT, targetColumn: targetColumnNames.dtInsert, targetType: VARCHAR },
  { column: sourceColumnNames.DT_DELETE, targetColumn: targetColumnNames.dtDelete, targetType: VARCHAR },
  { column: sourceColumnNames.DATE_OF_TRANSFER, targetColumn: targetColumnNames.dateOfTransfer, targetType: DATE, format },
  { column: sourceColumnNames.STATUS_P_CODE, targetColumn: targetColumnNames.statusPCode, targetType: VARCHAR },
  { column: sourceColumnNames.STATUS_S_CODE, targetColumn: targetColumnNames.statusSCode, targetType: VARCHAR },
  { column: sourceColumnNames.TRANSFER_APPLICATION_ID, targetColumn: targetColumnNames.transferApplicationId, targetType: VARCHAR },
  { column: sourceColumnNames.USER_INSERT, targetColumn: targetColumnNames.userInsert, targetType: VARCHAR },
  { column: sourceColumnNames.USER_DELETE, targetColumn: targetColumnNames.userDelete, targetType: VARCHAR },
  { column: sourceColumnNames.DT_UPDATE, targetColumn: targetColumnNames.dtUpdate, targetType: VARCHAR },
  { column: sourceColumnNames.DATA_SOURCE_P_CODE, targetColumn: targetColumnNames.dataSourcePCode, targetType: VARCHAR },
  { column: sourceColumnNames.DATA_SOURCE_S_CODE, targetColumn: targetColumnNames.dataSourceSCode, targetType: VARCHAR }
];

  return downloadAndProcessFile(folder, tdeLinkingTransferTransactions, columns, mapping)
}

module.exports = {
  stageTdeLinkingTransferTransactions
}
