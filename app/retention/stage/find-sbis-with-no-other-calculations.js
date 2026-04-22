const db = require('../../data')

const findSbisWithNoOtherCalculations = async (sbis, excludeCalculationIds, transaction) => {
  if (!sbis || sbis.length === 0) {
    return []
  }

  const otherCalculations = await db.delinkedCalculation.findAll({
    attributes: ['sbi'],
    where: {
      sbi: { [db.Sequelize.Op.in]: sbis },
      calculationId: excludeCalculationIds.length > 0
        ? { [db.Sequelize.Op.notIn]: excludeCalculationIds }
        : { [db.Sequelize.Op.ne]: null }
    },
    transaction
  })

  const sbisWithOtherCalculations = new Set(otherCalculations.map(c => c.sbi))
  return sbis.filter(sbi => !sbisWithOtherCalculations.has(sbi))
}

module.exports = {
  findSbisWithNoOtherCalculations
}
