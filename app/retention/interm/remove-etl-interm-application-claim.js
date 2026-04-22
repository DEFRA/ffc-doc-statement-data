const db = require('../../data')

const removeEtlIntermApplicationClaim = async (agreementId, transaction) => {
  await db.etlIntermApplicationClaim.destroy({
    where: {
      agreementId
    },
    transaction
  })
}

module.exports = {
  removeEtlIntermApplicationClaim
}
