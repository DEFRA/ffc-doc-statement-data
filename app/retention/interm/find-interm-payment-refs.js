const db = require('../../data')

const findIntermPaymentRefs = async (claimId, transaction) => {
  return db.etlIntermFinanceDax(transaction ?? undefined)
    .where({ claimId })
    .select('paymentRef')
}

module.exports = {
  findIntermPaymentRefs
}
