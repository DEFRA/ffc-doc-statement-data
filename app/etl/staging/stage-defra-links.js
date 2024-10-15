const path = require('path')
const { v4: uuidv4 } = require('uuid')
const storage = require('../../storage')
const storageConfig = require('../../config/storage')
const { defraLinksTable } = require('../../constants/tables')
const { runEtlProcess } = require('../run-etl-process')

const stageDefraLinks = async () => {
  const tempFilePath = path.join(__dirname, `defraLinks-${uuidv4()}.csv`)
  await storage.downloadFile(`${storageConfig.defraLinks.folder}/export.csv`, tempFilePath)
  const columns = [
    'CHANGE_TYPE',
    'CHANGE_TIME',
    'SUBJECT_ID',
    'DEFRA_ID',
    'DEFRA_TYPE',
    'MDM_ID'
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
      column: 'SUBJECT_ID',
      targetColumn: 'subject_id',
      targetType: 'number'
    },
    {
      column: 'DEFRA_ID',
      targetColumn: 'defra_id',
      targetType: 'varchar'
    },
    {
      column: 'DEFRA_TYPE',
      targetColumn: 'defra_type',
      targetType: 'varchar'
    },
    {
      column: 'MDM_ID',
      targetColumn: 'mdm_id',
      targetType: 'number'
    }
  ]
  return runEtlProcess({ tempFilePath, columns, table: defraLinksTable, mapping })
}

module.exports = {
  stageDefraLinks
}
