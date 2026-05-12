const db = require('../../data')

const findStageCssContractApps = async (applicationId, transaction) => {
  return db.etlStageCssContractApplications.findAll({
    attributes: ['contractId'],
    where: {
      applicationId
    },
    transaction
  })
}

module.exports = {
  findStageCssContractApps
}
