const db = require('../../database')

const removeEtlIntermTotalZeroValues = async (paymentRefs, transaction) => {
  await db.etlIntermTotalZeroValues(transaction ?? undefined).whereIn('paymentRef', paymentRefs).del()
}

module.exports = {
  removeEtlIntermTotalZeroValues
}
