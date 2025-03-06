const { appsTypes } = require('../../constants/tables')
const { downloadAndProcessFile, dateTimeFormat, monthDayYearDateTimeFormat } = require('./stage-utils')

const stageAppsTypes = async (monthDayFormat = false, folder = 'appsTypes') => {
  const format = monthDayFormat ? monthDayYearDateTimeFormat : dateTimeFormat

  const columns = [
    'CHANGE_TYPE', 'CHANGE_TIME', 'APP_TYPE_ID', 'SECTOR_P_CODE', 'SECTOR_S_CODE', 'SHORT_DESCRIPTION', 'EXT_DESCRIPTION', 'YEAR', 'WIN_OPEN_DATE', 'WIN_CLOSE_DATE'
  ]

  const mapping = [
    { column: 'CHANGE_TYPE', targetColumn: 'change_type', targetType: 'varchar' },
    { column: 'CHANGE_TIME', targetColumn: 'change_time', targetType: 'date', format },
    { column: 'APP_TYPE_ID', targetColumn: 'app_type_id', targetType: 'number' },
    { column: 'SECTOR_P_CODE', targetColumn: 'sector_p_code', targetType: 'varchar' },
    { column: 'SECTOR_S_CODE', targetColumn: 'sector_s_code', targetType: 'varchar' },
    { column: 'SHORT_DESCRIPTION', targetColumn: 'short_description', targetType: 'varchar' },
    { column: 'EXT_DESCRIPTION', targetColumn: 'ext_description', targetType: 'varchar' },
    { column: 'YEAR', targetColumn: 'year', targetType: 'number' },
    { column: 'WIN_OPEN_DATE', targetColumn: 'win_open_date', targetType: 'date', format },
    { column: 'WIN_CLOSE_DATE', targetColumn: 'win_close_date', targetType: 'date', format }
  ]

  return downloadAndProcessFile(folder, 'appsTypes', appsTypes, columns, mapping)
}

const stageAppsTypesDelinked = async () => {
  return stageAppsTypes(true, 'appsTypesDelinked')
}

module.exports = {
  stageAppsTypes,
  stageAppsTypesDelinked
}
