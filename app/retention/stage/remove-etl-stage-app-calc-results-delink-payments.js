const db = require('../../database')

const removeEtlStageAppCalcResultsDelinkPayments = async (calculationIds, transaction) => {
  await db.etlStageAppCalcResultsDelinkPayment(transaction ?? undefined).whereIn('calculationId', calculationIds).del()
}

module.exports = {
  removeEtlStageAppCalcResultsDelinkPayments
}
