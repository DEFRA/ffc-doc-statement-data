const db = require('../../database')

const removeEtlIntermFinanceDax = async (claimId, transaction) => {
  await db.etlIntermFinanceDax(transaction ?? undefined).where({ claimId }).del()
}

module.exports = {
  removeEtlIntermFinanceDax
}
