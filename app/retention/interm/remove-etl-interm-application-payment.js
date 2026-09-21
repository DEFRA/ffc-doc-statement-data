const db = require('../../data')

const removeEtlIntermApplicationPayment = async (applicationId, transaction) => {
  await db.etlIntermApplicationPayment(transaction ?? undefined).where({ applicationId }).del()
}

module.exports = {
  removeEtlIntermApplicationPayment
}
