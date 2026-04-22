const db = require('../../data')

const findIntermAppCalcResultsDelinkPayments = async (applicationId, frn, transaction) => {
  return db.etlIntermAppCalcResultsDelinkPayment.findAll({
    attributes: ['calculationId'],
    where: {
      applicationId,
      frn
    },
    transaction
  })
}

module.exports = {
  findIntermAppCalcResultsDelinkPayments
}
