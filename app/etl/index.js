const { loadETLData } = require('./load-etl-data')
const { renameExtracts } = require('./rename-extracts')
const { stageDelinkedExtracts } = require('./staging/delinked/stage-delinked-extracts')
const { stageSfi23Extracts } = require('./staging/sfi23/stage-sfi23-extracts')

module.exports = {
  renameExtracts,
  stageDelinkedExtracts,
  stageSfi23Extracts,
  loadETLData
}
