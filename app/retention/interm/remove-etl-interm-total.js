const db = require('../../database')

const removeEtlIntermTotal = async (paymentRefs, transaction) => {
  await db.etlIntermTotal(transaction ?? undefined).whereIn('paymentRef', paymentRefs).del()
}

module.exports = {
  removeEtlIntermTotal
}
