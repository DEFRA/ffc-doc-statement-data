const db = require('../../data')

const removeEtlStageFinanceDax = async (paymentRefs, transaction) => {
  await db.etlStageFinanceDax.destroy({
    where: {
      paymentRef: {
        [db.Sequelize.Op.in]: paymentRefs
      }
    },
    transaction
  })
}

module.exports = {
  removeEtlStageFinanceDax
}
