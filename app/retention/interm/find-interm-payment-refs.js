const db = require('../../data')

const findIntermPaymentRefs = async (agreementreference, transaction) => {
  return db.etlIntermFinanceDax.findAll({
    attributes: ['paymentRef'],
    where: {
      agreementreference
    },
    transaction
  })
}

module.exports = {
  findIntermPaymentRefs
}
