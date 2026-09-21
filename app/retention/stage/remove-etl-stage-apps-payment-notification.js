const db = require('../../data')

const removeEtlStageAppsPaymentNotification = async (applicationId, transaction) => {
  await db.etlStageAppsPaymentNotification(transaction ?? undefined).where({ applicationId }).del()
}

module.exports = {
  removeEtlStageAppsPaymentNotification
}
