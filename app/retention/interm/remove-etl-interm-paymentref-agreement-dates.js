const db = require('../../database')

const removeEtlIntermPaymentrefAgreementDates = async (paymentRefs, transaction) => {
  await db.etlIntermPaymentrefAgreementDates(transaction ?? undefined).whereIn('paymentRef', paymentRefs).del()
}

module.exports = {
  removeEtlIntermPaymentrefAgreementDates
}
