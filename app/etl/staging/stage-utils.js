const storage = require('../../storage')
const storageConfig = require('../../config/storage')
const { runEtlProcess } = require('../run-etl-process')

const dateTimeFormat = 'DD-MM-YYYY HH24:MI:SS'

const filterNullProperties = (obj) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))
}

const downloadAndProcessFile = async (folder, filePrefix, table, columns, mapping, transformer = null, nonProdTransformer = null) => {
  const file = `${storageConfig[folder].folder}/export.csv`
  const fileStream = await storage.downloadFileAsStream(file)
  const params = filterNullProperties({ fileStream, columns, table, mapping, transformer, nonProdTransformer, file })
  return runEtlProcess(params)
}

module.exports = {
  downloadAndProcessFile,
  dateTimeFormat
}
