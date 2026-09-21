const db = require('../../data')

const removeEtlStageFinanceDax = async (paymentRefs, transaction) => {
  await db.etlStageFinanceDax(transaction ?? undefined).whereIn('settlementvoucher', paymentRefs).del()
}

module.exports = {
  removeEtlStageFinanceDax
}
