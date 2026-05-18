const db = require('../../data')

const removeEtlStageAppCalcResultsDelinkPayments = async (calculationIds, transaction) => {
  await db.etlStageAppCalcResultsDelinkPayment.destroy({
    where: {
      calculationId: {
        [db.Sequelize.Op.in]: calculationIds
      }
    },
    transaction
  })
}

module.exports = {
  removeEtlStageAppCalcResultsDelinkPayments
}
