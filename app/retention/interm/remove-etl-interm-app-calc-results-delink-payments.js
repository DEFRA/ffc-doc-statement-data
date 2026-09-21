const db = require('../../data')

const removeEtlIntermAppCalcResultsDelinkPayments = async (applicationId, frn, transaction) => {
  await db.etlIntermAppCalcResultsDelinkPayment(transaction ?? undefined).where({ applicationId, frn }).del()
}

module.exports = {
  removeEtlIntermAppCalcResultsDelinkPayments
}
