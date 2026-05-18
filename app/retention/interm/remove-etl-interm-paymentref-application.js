const db = require('../../data')

const removeEtlIntermPaymentrefApplication = async (paymentRefs, transaction) => {
  await db.etlIntermPaymentrefApplication.destroy({
    where: {
      paymentRef: {
        [db.Sequelize.Op.in]: paymentRefs
      }
    },
    transaction
  })
}

module.exports = {
  removeEtlIntermPaymentrefApplication
}
