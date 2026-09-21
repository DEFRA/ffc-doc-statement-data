const db = require('../../data')

const removeEtlIntermApplicationClaim = async (agreementId, transaction) => {
  await db.etlIntermApplicationClaim(transaction ?? undefined).where({ agreementId }).del()
}

module.exports = {
  removeEtlIntermApplicationClaim
}
