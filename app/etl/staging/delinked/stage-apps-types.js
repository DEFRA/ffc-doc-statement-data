const path = require('path')
const { v4: uuidv4 } = require('uuid')
const storage = require('../../../storage')
const storageConfig = require('../../../config/delinked-storage')
const { appsTypesTable } = require('../../../constants/tables')
const { runEtlProcess } = require('./run-etl-process')

const stageAppsTypes = async () => {
  const file = `${storageConfig.appsTypes.folder}/export.csv`
  const tempFilePath = path.join(__dirname, `appsTypes-${uuidv4()}.csv`)
  await storage.downloadFile(file, tempFilePath)
  const columns = [
    'CHANGE_TYPE',
    'CHANGE_TIME',
    'APP_TYPE_ID',
    'SECTOR_P_CODE',
    'SECTOR_S_CODE',
    'SHORT_DESCRIPTION',
    'EXT_DESCRIPTION',
    'YEAR',
    'WIN_OPEN_DATE',
    'WIN_CLOSE_DATE'
  ]

  const mapping = [
    {
      column: 'CHANGE_TYPE',
      targetColumn: 'change_type',
      targetType: 'varchar'
    },
    {
      column: 'CHANGE_TIME',
      targetColumn: 'change_time',
      targetType: 'date',
      format: 'DD-MM-YYYY HH24:MI:SS'
    },
    {
      column: 'APP_TYPE_ID',
      targetColumn: 'app_type_id',
      targetType: 'number'
    },
    {
      column: 'SECTOR_P_CODE',
      targetColumn: 'sector_p_code',
      targetType: 'varchar'
    },
    {
      column: 'SECTOR_S_CODE',
      targetColumn: 'sector_s_code',
      targetType: 'varchar'
    },
    {
      column: 'SHORT_DESCRIPTION',
      targetColumn: 'short_description',
      targetType: 'varchar'
    },
    {
      column: 'EXT_DESCRIPTION',
      targetColumn: 'ext_description',
      targetType: 'varchar'
    },
    {
      column: 'YEAR',
      targetColumn: 'year',
      targetType: 'number'
    },
    {
      column: 'WIN_OPEN_DATE',
      targetColumn: 'win_open_date',
      targetType: 'date',
      format: 'DD-MM-YYYY HH24:MI:SS'
    },
    {
      column: 'WIN_CLOSE_DATE',
      targetColumn: 'win_close_date',
      targetType: 'date',
      format: 'DD-MM-YYYY HH24:MI:SS'
    }
  ]
  return runEtlProcess({ tempFilePath, columns, table: appsTypesTable, mapping, file })
}

module.exports = {
  stageAppsTypes
}
