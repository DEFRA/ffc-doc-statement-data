const db = require('../../data')

const removeEtlIntermTotalClaim = async (paymentRefs, transaction) => {
  await db.etlIntermTotalClaim.destroy({
    where: {
      paymentRef: {
        [db.Sequelize.Op.in]: paymentRefs
      }
    },
    transaction
  })
}

module.exports = {
  removeEtlIntermTotalClaim
}
