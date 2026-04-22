const db = require('../../data')

const removeEtlStageCssContractApplications = async (applicationId, transaction) => {
  await db.etlStageCssContractApplications.destroy({
    where: {
      applicationId
    },
    transaction
  })
}

module.exports = {
  removeEtlStageCssContractApplications
}
