const { loadETLData } = require('./load-etl-data')
const { prepareDWHExtracts } = require('./prepare-dwh-extracts')
const { stageDWHExtracts } = require('./stage-dwh-extracts')

module.exports = {
  prepareDWHExtracts,
  stageDWHExtracts,
  loadETLData
}
