const db = require('../../data')

const findSbisWithNoOtherCalculations = async (sbis, excludeCalculationIds, transaction) => {
  if (!sbis || sbis.length === 0) {
    return []
  }

  const otherCalculations = await db.delinkedCalculation(transaction ?? undefined)
    .whereIn('sbi', sbis)
    .modify((builder) => {
      if (excludeCalculationIds.length > 0) {
        builder.whereNotIn('calculationId', excludeCalculationIds)
      } else {
        builder.whereNotNull('calculationId')
      }
    })
    .select('sbi')

  const sbisWithOtherCalculations = new Set(otherCalculations.map(c => c.sbi))
  return sbis.filter(sbi => !sbisWithOtherCalculations.has(sbi))
}

module.exports = {
  findSbisWithNoOtherCalculations
}
