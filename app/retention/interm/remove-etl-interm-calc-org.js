const db = require('../../data')

const removeEtlIntermCalcOrg = async (applicationId, frn, transaction) => {
  await db.etlIntermCalcOrg(transaction ?? undefined).where({ applicationId, frn }).del()
}

module.exports = {
  removeEtlIntermCalcOrg
}
