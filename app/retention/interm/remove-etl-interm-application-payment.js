const db = require('../../data')

const removeEtlIntermApplicationPayment = async (applicationId, transaction) => {
  await db.etlIntermApplicationPayment.destroy({
    where: {
      applicationId
    },
    transaction
  })
}

module.exports = {
  removeEtlIntermApplicationPayment
}
