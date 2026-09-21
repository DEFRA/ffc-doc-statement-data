const db = require('../data')

const removeDelinkedCalculations = async (calculationIds, transaction) => {
  await db.delinkedCalculation(transaction ?? undefined).whereIn('calculationId', calculationIds).del()
}

module.exports = {
  removeDelinkedCalculations
}
