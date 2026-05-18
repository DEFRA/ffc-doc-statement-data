const db = require('../../data')

const removeEtlIntermOrg = async (sbis, transaction) => {
  await db.etlIntermOrg.destroy({
    where: {
      sbi: {
        [db.Sequelize.Op.in]: sbis
      }
    },
    transaction
  })
}

module.exports = {
  removeEtlIntermOrg
}
