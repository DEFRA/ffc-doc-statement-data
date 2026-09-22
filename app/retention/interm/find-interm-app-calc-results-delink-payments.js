const db = require('../../database')

const findIntermAppCalcResultsDelinkPayments = async (applicationId, frn, transaction) => {
  return db.etlIntermAppCalcResultsDelinkPayment(transaction ?? undefined)
    .where({ applicationId, frn })
    .select('calculationId')
}

module.exports = {
  findIntermAppCalcResultsDelinkPayments
}
