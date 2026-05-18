const db = require('../data')

const removeDelinkedCalculations = async (calculationIds, transaction) => {
  await db.delinkedCalculation.destroy({
    where: {
      calculationId: {
        [db.Sequelize.Op.in]: calculationIds
      }
    },
    transaction
  })
}

module.exports = {
  removeDelinkedCalculations
}
