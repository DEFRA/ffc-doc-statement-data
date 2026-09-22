const db = require('../../database')

const removeEtlIntermPaymentrefApplication = async (paymentRefs, transaction) => {
  await db.etlIntermPaymentrefApplication(transaction ?? undefined).whereIn('paymentRef', paymentRefs).del()
}

module.exports = {
  removeEtlIntermPaymentrefApplication
}
