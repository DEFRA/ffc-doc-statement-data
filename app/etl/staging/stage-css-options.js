const { cssOptions } = require('../../constants/tables')
const { downloadAndProcessFile, dateTimeFormat, monthDayYearDateTimeFormat } = require('./stage-utils')

const stageCSSOptions = async (monthDayFormat = false, folder = 'cssOptions') => {
  const format = monthDayFormat ? monthDayYearDateTimeFormat : dateTimeFormat

  const columns = [
    'CHANGE_TYPE', 'CHANGE_TIME', 'OPTION_TYPE_ID', 'OPTION_DESCRIPTION', 'OPTION_LONG_DESCRIPTION', 'DURATION', 'OPTION_CODE', 'CONTRACT_TYPE_ID', 'START_DT', 'END_DT', 'GROUP_ID'
  ]

  const mapping = [
    { column: 'CHANGE_TYPE', targetColumn: 'change_type', targetType: 'varchar' },
    { column: 'CHANGE_TIME', targetColumn: 'change_time', targetType: 'date', format },
    { column: 'OPTION_TYPE_ID', targetColumn: 'option_type_id', targetType: 'number' },
    { column: 'OPTION_DESCRIPTION', targetColumn: 'option_description', targetType: 'varchar' },
    { column: 'OPTION_LONG_DESCRIPTION', targetColumn: 'option_long_description', targetType: 'varchar' },
    { column: 'DURATION', targetColumn: 'duration', targetType: 'number' },
    { column: 'OPTION_CODE', targetColumn: 'option_code', targetType: 'varchar' },
    { column: 'CONTRACT_TYPE_ID', targetColumn: 'contract_type_id', targetType: 'number' },
    { column: 'START_DT', targetColumn: 'start_dt', targetType: 'date', format },
    { column: 'END_DT', targetColumn: 'end_dt', targetType: 'date', format },
    { column: 'GROUP_ID', targetColumn: 'group_id', targetType: 'varchar' }
  ]

  return downloadAndProcessFile(folder, 'cssOptions', cssOptions, columns, mapping)
}

const stageCSSOptionsDelinked = async () => {
  return stageCSSOptions(true, 'cssOptionsDelinked')
}

module.exports = {
  stageCSSOptions,
  stageCSSOptionsDelinked
}
