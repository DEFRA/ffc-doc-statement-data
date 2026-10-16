const db = require('../../database')

const removeEtlStageAppsPaymentNotification = async (applicationId, transaction) => {
  await db.etlStageAppsPaymentNotification(transaction ?? undefined).where({ applicationId }).del()
}

module.exports = {
  removeEtlStageAppsPaymentNotification
}
