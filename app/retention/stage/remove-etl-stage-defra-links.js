const db = require('../../database')

const removeEtlStageDefraLinks = async (subjectIds, transaction) => {
  await db.etlStageDefraLinks(transaction ?? undefined).whereIn('subjectId', subjectIds).del()
}

module.exports = {
  removeEtlStageDefraLinks
}
