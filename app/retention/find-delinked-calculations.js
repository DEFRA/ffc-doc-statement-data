const db = require('../data')

const findDelinkedCalculations = async (agreementNumber, frn, transaction) => {
  return db.delinkedCalculation.findAll({
    attributes: ['calculationId', 'sbi'],
    where: {
      agreementNumber,
      frn
    },
    transaction
  })
}

module.exports = {
  findDelinkedCalculations
}
