const path = require('path')
const { v4: uuidv4 } = require('uuid')
const storage = require('../../storage')
const storageConfig = require('../../config/storage')
const { calculationsDetailsTable } = require('../../constants/tables')
const { runEtlProcess } = require('../run-etl-process')

const stageCalculationDetails = async () => {
  const filename = `${storageConfig.calculationsDetails.folder}/export.csv`
  const tempFilePath = path.join(__dirname, `calculationDetails-${uuidv4()}.csv`)
  await storage.downloadFile(filename, tempFilePath)
  await storage.deleteFile(filename)
  const columns = [
    'CHANGE_TYPE',
    'CHANGE_TIME',
    'APPLICATION_ID',
    'ID_CLC_HEADER',
    'CALCULATION_ID',
    'CALCULATION_DT',
    'RANKED'
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
      column: 'APPLICATION_ID',
      targetColumn: 'application_id',
      targetType: 'number'
    },
    {
      column: 'ID_CLC_HEADER',
      targetColumn: 'id_clc_header',
      targetType: 'number'
    },
    {
      column: 'CALCULATION_ID',
      targetColumn: 'calculation_id',
      targetType: 'number'
    },
    {
      column: 'CALCULATION_DT',
      targetColumn: 'calculation_dt',
      targetType: 'date',
      format: 'DD-MM-YYYY HH24:MI:SS'
    },
    {
      column: 'RANKED',
      targetColumn: 'ranked',
      targetType: 'number'
    }
  ]
  return runEtlProcess({ tempFilePath, columns, table: calculationsDetailsTable, mapping })
}

module.exports = {
  stageCalculationDetails
}
