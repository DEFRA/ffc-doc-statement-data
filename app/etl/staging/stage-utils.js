const storage = require('../../storage')
const etlConfig = require('../../config/etl')
const { runEtlProcess } = require('../run-etl-process')

const dateTimeFormat = 'DD-MM-YYYY HH24:MI:SS'
const monthDayYearDateTimeFormat = 'MM-DD-YYYY HH24:MI:SS'

const filterNullProperties = (obj) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))
}

const downloadAndProcessFile = async (folder, table, columns, mapping, excludedFields = null, transformer = null, nonProdTransformer = null) => {
  const file = `${etlConfig[folder].folder}/export.csv`
  const fileStream = await storage.downloadFileAsStream(file)
  const params = filterNullProperties({ fileStream, columns, table, mapping, transformer, nonProdTransformer, excludedFields, file })
  return runEtlProcess(params)
}

module.exports = {
  downloadAndProcessFile,
  dateTimeFormat,
  monthDayYearDateTimeFormat
}
