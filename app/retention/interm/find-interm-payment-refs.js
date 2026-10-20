const db = require('../../database')

const findIntermPaymentRefs = async (claimId, transaction) => {
  return db.etlIntermFinanceDax(transaction ?? undefined)
    .where({ claimId })
    .select('paymentRef')
}

module.exports = {
  findIntermPaymentRefs
}
