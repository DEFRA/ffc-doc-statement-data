const db = require('../../data')

const removeEtlIntermTotal = async (paymentRefs, transaction) => {
  await db.etlIntermTotal.destroy({
    where: {
      paymentRef: {
        [db.Sequelize.Op.in]: paymentRefs
      }
    },
    transaction
  })
}

module.exports = {
  removeEtlIntermTotal
}
