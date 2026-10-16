const db = require('../../database')

const removeEtlStageAppCalcResultsDelinkPayments = async (calculationIds, transaction) => {
  await db.etlStageAppCalcResultsDelinkPayments(transaction ?? undefined).whereIn('calculationId', calculationIds).del()
}

module.exports = {
  removeEtlStageAppCalcResultsDelinkPayments
}
