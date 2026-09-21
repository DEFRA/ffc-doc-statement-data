const db = require('../../data')

const removeEtlStageOrganisation = async (sbis, transaction) => {
  await db.etlStageOrganisation(transaction ?? undefined).whereIn('sbi', sbis).del()
}

module.exports = {
  removeEtlStageOrganisation
}
