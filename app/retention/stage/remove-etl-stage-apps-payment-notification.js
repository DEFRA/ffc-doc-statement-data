const db = require('../../data')

const removeEtlStageAppsPaymentNotification = async (applicationId, transaction) => {
  await db.etlStageAppsPaymentNotification.destroy({
    where: {
      applicationId
    },
    transaction
  })
}

module.exports = {
  removeEtlStageAppsPaymentNotification
}
