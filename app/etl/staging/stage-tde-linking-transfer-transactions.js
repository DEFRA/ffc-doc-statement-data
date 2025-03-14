const { tdeLinkingTransferTransactions } = require('../../constants/tables')
const { downloadAndProcessFile, monthDayYearDateTimeFormat } = require('./stage-utils')

const stageTdeLinkingTransferTransactions = async () => {
  const format = monthDayYearDateTimeFormat
  const folder = 'tdeLinkingTransferTransactions'

  const columns = [
    'CHANGE_TYPE', 'CHANGE_TIME', 'TRANSFEROR_SBI', 'TRANSFEROR_CUAA', 'TRANSFEROR_PK_CUAA', 'TRANSFEREE_SBI',
    'TRANSFEREE_CUAA', 'TRANSFEREE_PK_CUAA', 'TOTAL_AMOUNT_TRANSFERRED', 'TRANSFER_AMOUNT', 'TRANSFER_AMOUNT_TRANS_IN',
    'DT_INSERT', 'DT_DELETE', 'DATE_OF_TRANSFER', 'STATUS_P_CODE', 'STATUS_S_CODE', 'TRANSFER_APPLICATION_ID', 'USER_INSERT', 'USER_DELETE',
    'DT_UPDATE', 'DATA_SOURCE_P_CODE', 'DATA_SOURCE_S_CODE'
  ]

  const mapping = [
    { column: 'CHANGE_TYPE', targetColumn: 'change_type', targetType: 'varchar' },
    { column: 'CHANGE_TIME', targetColumn: 'change_time', targetType: 'date', format },
    { column: 'TRANSFEROR_SBI', targetColumn: 'transferor_sbi', targetType: 'varchar' },
    { column: 'TRANSFEROR_CUAA', targetColumn: 'transferor_cuaa', targetType: 'varchar' },
    { column: 'TRANSFEROR_PK_CUAA', targetColumn: 'transferor_pk_cuaa', targetType: 'varchar' },
    { column: 'TRANSFEREE_SBI', targetColumn: 'transferee_sbi', targetType: 'varchar' },
    { column: 'TRANSFEREE_CUAA', targetColumn: 'transferee_cuaa', targetType: 'varchar' },
    { column: 'TRANSFEREE_PK_CUAA', targetColumn: 'transferee_pk_cuaa', targetType: 'varchar' },
    { column: 'TOTAL_AMOUNT_TRANSFERRED', targetColumn: 'total_amount_transferred', targetType: 'number' },
    { column: 'TRANSFER_AMOUNT', targetColumn: 'transfer_amount', targetType: 'number' },
    { column: 'TRANSFER_AMOUNT_TRANS_IN', targetColumn: 'transfer_amount_trans_in', targetType: 'number' },
    { column: 'DT_INSERT', targetColumn: 'dt_insert', targetType: 'varchar' },
    { column: 'DT_DELETE', targetColumn: 'dt_delete', targetType: 'varchar' },
    { column: 'DATE_OF_TRANSFER', targetColumn: 'date_of_transfer', targetType: 'date', format },
    { column: 'STATUS_P_CODE', targetColumn: 'status_p_code', targetType: 'varchar' },
    { column: 'STATUS_S_CODE', targetColumn: 'status_s_code', targetType: 'varchar' },
    { column: 'TRANSFER_APPLICATION_ID', targetColumn: 'transfer_application_id', targetType: 'varchar' },
    { column: 'USER_INSERT', targetColumn: 'user_insert', targetType: 'varchar' },
    { column: 'USER_DELETE', targetColumn: 'user_delete', targetType: 'varchar' },
    { column: 'DT_UPDATE', targetColumn: 'dt_update', targetType: 'varchar' },
    { column: 'DATA_SOURCE_P_CODE', targetColumn: 'data_source_p_code', targetType: 'varchar' },
    { column: 'DATA_SOURCE_S_CODE', targetColumn: 'data_source_s_code', targetType: 'varchar' }
  ]

  return downloadAndProcessFile(folder, tdeLinkingTransferTransactions, columns, mapping)
}

module.exports = {
  stageTdeLinkingTransferTransactions
}
