const db = require('../../data')

const removeEtlStageBusinessAddressContactV = async (sbis, transaction) => {
  await db.etlStageBusinessAddressContactV(transaction ?? undefined).whereIn('sbi', sbis).del()
}

module.exports = {
  removeEtlStageBusinessAddressContactV
}
