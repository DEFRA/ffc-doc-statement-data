const db = require('../../database')

const removeEtlIntermAppCalcResultsDelinkPayments = async (applicationId, frn, transaction) => {
  await db.etlIntermAppCalcResultsDelinkPayments(transaction ?? undefined).where({ applicationId, frn }).del()
}

module.exports = {
  removeEtlIntermAppCalcResultsDelinkPayments
}
