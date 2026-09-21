const db = require('../../data')

const removeEtlIntermPaymentrefOrg = async (paymentRefs, frn, transaction) => {
  await db.etlIntermPaymentrefOrg(transaction ?? undefined).whereIn('paymentRef', paymentRefs).where({ frn }).del()
}

module.exports = {
  removeEtlIntermPaymentrefOrg
}
