const db = require('../../data')

const removeEtlIntermTotalClaim = async (paymentRefs, transaction) => {
  await db.etlIntermTotalClaim(transaction ?? undefined).whereIn('paymentRef', paymentRefs).del()
}

module.exports = {
  removeEtlIntermTotalClaim
}
