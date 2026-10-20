const db = require('../../database')

const removeEtlIntermOrg = async (sbis, transaction) => {
  await db.etlIntermOrg(transaction ?? undefined).whereIn('sbi', sbis).del()
}

module.exports = {
  removeEtlIntermOrg
}
