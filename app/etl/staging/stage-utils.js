const path = require('path')
const { v4: uuidv4 } = require('uuid')
const storage = require('../../storage')
const storageConfig = require('../../config/storage')
const { runEtlProcess } = require('../run-etl-process')

const dateTimeFormat = 'DD-MM-YYYY HH24:MI:SS'
const monthDayYearDateTimeFormat = 'MM-DD-YYYY HH24:MI:SS'

const filterNullProperties = (obj) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))
}

const downloadAndProcessFile = async (folder, filePrefix, table, columns, mapping, transformer = null, nonProdTransformer = null) => {
  const file = `${storageConfig[folder].folder}/export.csv`
  const tempFilePath = path.join(__dirname, `${filePrefix}-${uuidv4()}.csv`)
  await storage.downloadFile(file, tempFilePath)
  const params = filterNullProperties({ tempFilePath, columns, table, mapping, transformer, nonProdTransformer, file })
  return runEtlProcess(params)
}

module.exports = {
  downloadAndProcessFile,
  dateTimeFormat,
  monthDayYearDateTimeFormat
}
