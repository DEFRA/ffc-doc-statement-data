const db = require('../../database')

const removeEtlStageCalculationDetails = async (applicationId, transaction) => {
  await db.etlStageCalculationDetails(transaction ?? undefined).where({ applicationId }).del()
}

module.exports = {
  removeEtlStageCalculationDetails
}
