const db = require('../data')

const removeD365 = async (calculationIds, transaction) => {
  await db.d365(transaction ?? undefined).whereIn('calculationId', calculationIds).del()
}

module.exports = {
  removeD365
}
