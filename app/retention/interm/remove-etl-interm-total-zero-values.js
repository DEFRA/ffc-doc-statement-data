const db = require('../../data')

const removeEtlIntermTotalZeroValues = async (paymentRefs, transaction) => {
  await db.etlIntermTotalZeroValues.destroy({
    where: {
      paymentRef: {
        [db.Sequelize.Op.in]: paymentRefs
      }
    },
    transaction
  })
}

module.exports = {
  removeEtlIntermTotalZeroValues
}
