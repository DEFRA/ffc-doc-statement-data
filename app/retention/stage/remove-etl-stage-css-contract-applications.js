const db = require('../../data')

const removeEtlStageCssContractApplications = async (applicationId, transaction) => {
  await db.etlStageCssContractApplications(transaction ?? undefined).where({ applicationId }).del()
}

module.exports = {
  removeEtlStageCssContractApplications
}
