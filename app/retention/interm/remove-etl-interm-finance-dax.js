const db = require('../../data')

const removeEtlIntermFinanceDax = async (claimId, transaction) => {
  await db.etlIntermFinanceDax(transaction ?? undefined).where({ claimId }).del()
}

module.exports = {
  removeEtlIntermFinanceDax
}
