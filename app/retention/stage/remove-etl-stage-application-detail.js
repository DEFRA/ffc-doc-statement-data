const db = require('../../data')

const removeEtlStageApplicationDetail = async (applicationId, transaction) => {
  await db.etlStageApplicationDetail.destroy({
    where: {
      applicationId
    },
    transaction
  })
}

module.exports = {
  removeEtlStageApplicationDetail
}
