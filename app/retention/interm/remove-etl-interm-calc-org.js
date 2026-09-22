const db = require('../../database')

const removeEtlIntermCalcOrg = async (applicationId, frn, transaction) => {
  await db.etlIntermCalcOrg(transaction ?? undefined).where({ applicationId, frn }).del()
}

module.exports = {
  removeEtlIntermCalcOrg
}
