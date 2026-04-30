const db = require('../../data')

const removeEtlIntermCalcOrg = async (applicationId, frn, transaction) => {
  await db.etlIntermCalcOrg.destroy({
    where: {
      applicationId,
      frn
    },
    transaction
  })
}

module.exports = {
  removeEtlIntermCalcOrg
}
