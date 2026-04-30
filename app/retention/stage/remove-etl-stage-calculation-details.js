const db = require('../../data')

const removeEtlStageCalculationDetails = async (applicationId, transaction) => {
  await db.etlStageCalculationDetails.destroy({
    where: {
      applicationId
    },
    transaction
  })
}

module.exports = {
  removeEtlStageCalculationDetails
}
