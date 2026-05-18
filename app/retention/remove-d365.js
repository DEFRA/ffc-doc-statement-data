const db = require('../data')

const removeD365 = async (calculationIds, transaction) => {
  await db.d365.destroy({
    where: {
      calculationId: {
        [db.Sequelize.Op.in]: calculationIds
      }
    },
    transaction
  })
}

module.exports = {
  removeD365
}
