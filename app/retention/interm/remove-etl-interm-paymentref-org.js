const db = require('../../data')

const removeEtlIntermPaymentrefOrg = async (paymentRefs, frn, transaction) => {
  await db.etlIntermPaymentrefOrg.destroy({
    where: {
      paymentRef: {
        [db.Sequelize.Op.in]: paymentRefs
      },
      frn
    },
    transaction
  })
}

module.exports = {
  removeEtlIntermPaymentrefOrg
}
