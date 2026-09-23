const db = require('../../database')

const removeEtlIntermApplicationClaim = async (agreementId, transaction) => {
  await db.etlIntermApplicationClaim(transaction ?? undefined).where({ agreementId }).del()
}

module.exports = {
  removeEtlIntermApplicationClaim
}
