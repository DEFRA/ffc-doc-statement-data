const db = require('../../data')

const removeEtlStageCssContracts = async (calculationIds, transaction) => {
  await db.etlStageCssContracts.destroy({
    where: {
      calculationId: {
        [db.Sequelize.Op.in]: calculationIds
      }
    },
    transaction
  })
}

module.exports = {
  removeEtlStageCssContracts
}
