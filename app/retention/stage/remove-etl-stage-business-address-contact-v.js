const db = require('../../data')

const removeEtlStageBusinessAddressContactV = async (sbis, transaction) => {
  await db.etlStageBusinessAddressContactV.destroy({
    where: {
      sbi: {
        [db.Sequelize.Op.in]: sbis
      }
    },
    transaction
  })
}

module.exports = {
  removeEtlStageBusinessAddressContactV
}
