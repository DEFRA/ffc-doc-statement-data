const db = require('../../data')

const removeEtlIntermApplicationContract = async (applicationId, transaction) => {
  await db.etlIntermApplicationContract.destroy({
    where: {
      applicationId
    },
    transaction
  })
}

module.exports = {
  removeEtlIntermApplicationContract
}
