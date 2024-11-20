const path = require('path')
const { v4: uuidv4 } = require('uuid')
const storage = require('../../storage')
const storageConfig = require('../../config/storage')
const { cssOptionsTable } = require('../../constants/tables')
const { runEtlProcess } = require('../run-etl-process')

const stageCSSOptions = async () => {
  const file = `${storageConfig.cssOptions.folder}/export.csv`
  const tempFilePath = path.join(__dirname, `cssOptions-${uuidv4()}.csv`)
  await storage.downloadFile(file, tempFilePath)
  const columns = [
    'CHANGE_TYPE',
    'CHANGE_TIME',
    'OPTION_TYPE_ID',
    'OPTION_DESCRIPTION',
    'OPTION_LONG_DESCRIPTION',
    'DURATION',
    'OPTION_CODE',
    'CONTRACT_TYPE_ID',
    'START_DT',
    'END_DT',
    'GROUP_ID'
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
      column: 'OPTION_TYPE_ID',
      targetColumn: 'option_type_id',
      targetType: 'number'
    },
    {
      column: 'OPTION_DESCRIPTION',
      targetColumn: 'option_description',
      targetType: 'varchar'
    },
    {
      column: 'OPTION_LONG_DESCRIPTION',
      targetColumn: 'option_long_description',
      targetType: 'varchar'
    },
    {
      column: 'DURATION',
      targetColumn: 'duration',
      targetType: 'number'
    },
    {
      column: 'OPTION_CODE',
      targetColumn: 'option_code',
      targetType: 'varchar'
    },
    {
      column: 'CONTRACT_TYPE_ID',
      targetColumn: 'contract_type_id',
      targetType: 'number'
    },
    {
      column: 'START_DT',
      targetColumn: 'start_dt',
      targetType: 'date',
      format: 'DD-MM-YYYY HH24:MI:SS'
    },
    {
      column: 'END_DT',
      targetColumn: 'end_dt',
      targetType: 'date',
      format: 'DD-MM-YYYY HH24:MI:SS'
    },
    {
      column: 'GROUP_ID',
      targetColumn: 'group_id',
      targetType: 'varchar'
    }
  ]
  return runEtlProcess({ tempFilePath, columns, table: cssOptionsTable, mapping, file })
}

module.exports = {
  stageCSSOptions
}
