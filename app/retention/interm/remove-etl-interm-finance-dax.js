const db = require('../../data')

const removeEtlIntermFinanceDax = async (claimId, transaction) => {
  await db.etlIntermFinanceDax.destroy({
    where: {
      claimId
    },
    transaction
  })
}

module.exports = {
  removeEtlIntermFinanceDax
}
