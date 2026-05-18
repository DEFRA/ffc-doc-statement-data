const db = require('../../data')

const removeEtlIntermPaymentrefAgreementDates = async (paymentRefs, transaction) => {
  await db.etlIntermPaymentrefAgreementDates.destroy({
    where: {
      paymentRef: {
        [db.Sequelize.Op.in]: paymentRefs
      }
    },
    transaction
  })
}

module.exports = {
  removeEtlIntermPaymentrefAgreementDates
}
