const { cssContractApplications } = require('../../constants/tables')
const { downloadAndProcessFile, dateTimeFormat } = require('./stage-utils')

const stageCSSContractApplications = async () => {
  const columns = [
    'CHANGE_TYPE', 'CHANGE_TIME', 'PKID', 'INSERT_DT', 'DELETE_DT', 'CONTRACT_ID', 'APPLICATION_ID', 'TYPE_P_CODE', 'TYPE_S_CODE', 'DATA_SOURCE_P_CODE', 'DATA_SOURCE_S_CODE', 'START_DT', 'END_DT', 'VALID_START_FLAG', 'VALID_END_FLAG', 'START_ACT_ID', 'END_ACT_ID', 'LAST_UPDATE_DT', 'USER_FLD'
  ]

  const mapping = [
    { column: 'CHANGE_TYPE', targetColumn: 'change_type', targetType: 'varchar' },
    { column: 'CHANGE_TIME', targetColumn: 'change_time', targetType: 'date', format: dateTimeFormat },
    { column: 'PKID', targetColumn: 'pkid', targetType: 'number' },
    { column: 'INSERT_DT', targetColumn: 'insert_dt', targetType: 'date', format: dateTimeFormat },
    { column: 'DELETE_DT', targetColumn: 'delete_dt', targetType: 'date', format: dateTimeFormat },
    { column: 'CONTRACT_ID', targetColumn: 'contract_id', targetType: 'number' },
    { column: 'APPLICATION_ID', targetColumn: 'application_id', targetType: 'number' },
    { column: 'TYPE_P_CODE', targetColumn: 'type_p_code', targetType: 'varchar' },
    { column: 'TYPE_S_CODE', targetColumn: 'type_s_code', targetType: 'varchar' },
    { column: 'DATA_SOURCE_P_CODE', targetColumn: 'data_source_p_code', targetType: 'varchar' },
    { column: 'DATA_SOURCE_S_CODE', targetColumn: 'data_source_s_code', targetType: 'varchar' },
    { column: 'START_DT', targetColumn: 'start_dt', targetType: 'date', format: dateTimeFormat },
    { column: 'END_DT', targetColumn: 'end_dt', targetType: 'date', format: dateTimeFormat },
    { column: 'VALID_START_FLAG', targetColumn: 'valid_start_flag', targetType: 'varchar' },
    { column: 'VALID_END_FLAG', targetColumn: 'valid_end_flag', targetType: 'varchar' },
    { column: 'START_ACT_ID', targetColumn: 'start_act_id', targetType: 'number' },
    { column: 'END_ACT_ID', targetColumn: 'end_act_id', targetType: 'number' },
    { column: 'LAST_UPDATE_DT', targetColumn: 'last_update_dt', targetType: 'date', format: dateTimeFormat },
    { column: 'USER_FLD', targetColumn: 'USER', targetType: 'varchar' }
  ]

  return downloadAndProcessFile('cssContractApplications', 'cssContractApplications', cssContractApplications, columns, mapping)
}

module.exports = {
  stageCSSContractApplications
}
