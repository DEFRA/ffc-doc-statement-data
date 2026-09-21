const db = require('../../data')

const removeEtlStageDefraLinks = async (subjectIds, transaction) => {
  await db.etlStageDefraLinks(transaction ?? undefined).whereIn('subjectId', subjectIds).del()
}

module.exports = {
  removeEtlStageDefraLinks
}
