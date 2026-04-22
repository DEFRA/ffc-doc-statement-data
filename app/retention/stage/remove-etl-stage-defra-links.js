const db = require('../../data')

const removeEtlStageDefraLinks = async (subjectIds, transaction) => {
  await db.etlStageCssContracts.destroy({
    where: {
      subjectId: {
        [db.Sequelize.Op.in]: subjectIds
      }
    },
    transaction
  })
}

module.exports = {
  removeEtlStageDefraLinks
}
