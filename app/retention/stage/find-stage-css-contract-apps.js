const db = require('../../data')

const findStageCssContractApps = async (applicationId, transaction) => {
  return db.etlStageCssContractApplications(transaction ?? undefined)
    .where({ applicationId })
    .select('contractId')
}

module.exports = {
  findStageCssContractApps
}
