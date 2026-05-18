const db = require('../../data')

const removeEtlIntermAppCalcResultsDelinkPayments = async (applicationId, frn, transaction) => {
  await db.etlIntermAppCalcResultsDelinkPayment.destroy({
    where: {
      applicationId,
      frn
    },
    transaction
  })
}

module.exports = {
  removeEtlIntermAppCalcResultsDelinkPayments
}
