const db = require('../../data')

const findStageAppDetails = async (applicationId, transaction) => {
  return db.etlStageApplicationDetail(transaction ?? undefined)
    .where({ applicationId })
    .select('subjectId')
}

module.exports = {
  findStageAppDetails
}
