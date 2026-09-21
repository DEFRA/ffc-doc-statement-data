const db = require('../../data')

const removeEtlIntermApplicationContract = async (applicationId, transaction) => {
  await db.etlIntermApplicationContract(transaction ?? undefined).where({ applicationId }).del()
}

module.exports = {
  removeEtlIntermApplicationContract
}
