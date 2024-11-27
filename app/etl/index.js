const { loadETLData } = require('./load-etl-data')
const { renameExtracts } = require('./rename-extracts')
const { stageExtracts } = require('./staging/sfi23/stage-extracts')

module.exports = {
  renameExtracts,
  stageExtracts,
  loadETLData
}
