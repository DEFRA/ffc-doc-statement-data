const db = require('../../data')

const removeEtlStageCssContracts = async (contractIds, transaction) => {
  await db.etlStageCssContracts(transaction ?? undefined).whereIn('contractId', contractIds).del()
}

module.exports = {
  removeEtlStageCssContracts
}
