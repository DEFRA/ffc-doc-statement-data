const { loadETLData } = require('./load-etl-data')
const { renameExtracts } = require('./rename-extracts')
const { stageExtracts } = require('./stage-extracts')

module.exports = {
  renameExtracts,
  stageExtracts,
  loadETLData
}
