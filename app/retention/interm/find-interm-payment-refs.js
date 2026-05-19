const db = require('../../data')

const findIntermPaymentRefs = async (claimId, transaction) => {
  return db.etlIntermFinanceDax.findAll({
    attributes: ['paymentRef'],
    where: {
      claimId
    },
    transaction
  })
}

module.exports = {
  findIntermPaymentRefs
}
