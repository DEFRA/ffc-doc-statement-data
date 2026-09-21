const db = require('../../data')

const removeEtlStageApplicationDetail = async (applicationId, transaction) => {
  await db.etlStageApplicationDetail(transaction ?? undefined).where({ applicationId }).del()
}

module.exports = {
  removeEtlStageApplicationDetail
}
