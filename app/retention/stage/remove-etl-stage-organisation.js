const db = require('../../data')

const removeEtlStageOrganisation = async (sbis, transaction) => {
  await db.etlStageOrganisation.destroy({
    where: {
      sbi: {
        [db.Sequelize.Op.in]: sbis
      }
    },
    transaction
  })
}

module.exports = {
  removeEtlStageOrganisation
}
