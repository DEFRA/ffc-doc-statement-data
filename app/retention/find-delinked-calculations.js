const db = require('../database')

const findDelinkedCalculations = async (applicationId, frn, transaction) => {
  return db.delinkedCalculation(transaction ?? undefined)
    .where({ applicationId, frn })
    .select('calculationId', 'sbi')
}

module.exports = {
  findDelinkedCalculations
}
