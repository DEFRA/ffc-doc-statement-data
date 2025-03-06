const { cssContract } = require('../../constants/tables')
const { downloadAndProcessFile, dateTimeFormat, monthDayYearDateTimeFormat } = require('./stage-utils')

const stageCSSContract = async (monthDayFormat = false, folder = 'cssContract') => {
  const format = monthDayFormat ? monthDayYearDateTimeFormat : dateTimeFormat

  const columns = [
    'CHANGE_TYPE', 'CHANGE_TIME', 'PKID', 'INSERT_DT', 'DELETE_DT', 'CONTRACT_ID', 'CONTRACT_CODE', 'CONTRACT_TYPE_ID', 'CONTRACT_TYPE_DESCRIPTION', 'CONTRACT_DESCRIPTION', 'CONTRACT_STATE_P_CODE', 'CONTRACT_STATE_S_CODE', 'DATA_SOURCE_P_CODE', 'DATA_SOURCE_S_CODE', 'START_DT', 'END_DT', 'VALID_START_FLAG', 'VALID_END_FLAG', 'START_ACT_ID', 'END_ACT_ID', 'LAST_UPDATE_DT', 'USER_FLD'
  ]

  const mapping = [
    { column: 'CHANGE_TYPE', targetColumn: 'change_type', targetType: 'varchar' },
    { column: 'CHANGE_TIME', targetColumn: 'change_time', targetType: 'date', format },
    { column: 'PKID', targetColumn: 'pkid', targetType: 'number' },
    { column: 'INSERT_DT', targetColumn: 'insert_dt', targetType: 'date', format },
    { column: 'DELETE_DT', targetColumn: 'delete_dt', targetType: 'date', format },
    { column: 'CONTRACT_ID', targetColumn: 'contract_id', targetType: 'number' },
    { column: 'CONTRACT_CODE', targetColumn: 'contract_code', targetType: 'varchar' },
    { column: 'CONTRACT_TYPE_ID', targetColumn: 'contract_type_id', targetType: 'number' },
    { column: 'CONTRACT_TYPE_DESCRIPTION', targetColumn: 'contract_type_description', targetType: 'varchar' },
    { column: 'CONTRACT_DESCRIPTION', targetColumn: 'contract_description', targetType: 'varchar' },
    { column: 'CONTRACT_STATE_P_CODE', targetColumn: 'contract_state_p_code', targetType: 'varchar' },
    { column: 'CONTRACT_STATE_S_CODE', targetColumn: 'contract_state_s_code', targetType: 'varchar' },
    { column: 'DATA_SOURCE_P_CODE', targetColumn: 'data_source_p_code', targetType: 'varchar' },
    { column: 'DATA_SOURCE_S_CODE', targetColumn: 'data_source_s_code', targetType: 'varchar' },
    { column: 'START_DT', targetColumn: 'start_dt', targetType: 'date', format },
    { column: 'END_DT', targetColumn: 'end_dt', targetType: 'date', format },
    { column: 'VALID_START_FLAG', targetColumn: 'valid_start_flag', targetType: 'varchar' },
    { column: 'VALID_END_FLAG', targetColumn: 'valid_end_flag', targetType: 'varchar' },
    { column: 'START_ACT_ID', targetColumn: 'start_act_id', targetType: 'number' },
    { column: 'END_ACT_ID', targetColumn: 'end_act_id', targetType: 'number' },
    { column: 'LAST_UPDATE_DT', targetColumn: 'last_update_dt', targetType: 'date', format },
    { column: 'USER_FLD', targetColumn: 'USER', targetType: 'varchar' }
  ]

  const transformer = [
    { column: 'CONTRACT_DESCRIPTION', find: "'", replace: "''", all: true }
  ]

  return downloadAndProcessFile(folder, 'cssContract', cssContract, columns, mapping, transformer)
}

const stageCSSContractsDelinked = async () => {
  return stageCSSContract(true, 'cssContractDelinked')
}

module.exports = {
  stageCSSContract,
  stageCSSContractsDelinked
}
