const db = require('../../database')

const removeEtlStageFinanceDax = async (paymentRefs, transaction) => {
  await db.etlStageFinanceDax(transaction ?? undefined).whereIn('settlementvoucher', paymentRefs).del()
}

module.exports = {
  removeEtlStageFinanceDax
}
