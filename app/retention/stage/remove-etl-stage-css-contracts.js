const db = require('../../data')

const removeEtlStageCssContracts = async (contractIds, transaction) => {
  await db.etlStageCssContracts.destroy({
    where: {
      contractId: {
        [db.Sequelize.Op.in]: contractIds
      }
    },
    transaction
  })
}

module.exports = {
  removeEtlStageCssContracts
}
