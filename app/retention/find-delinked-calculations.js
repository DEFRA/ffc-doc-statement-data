const db = require('../data')

const findDelinkedCalculations = async (applicationId, frn, transaction) => {
  return db.delinkedCalculation.findAll({
    attributes: ['calculationId', 'sbi'],
    where: {
      applicationId,
      frn
    },
    transaction
  })
}

module.exports = {
  findDelinkedCalculations
}
