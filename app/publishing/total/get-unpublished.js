const getUnpublishedTotal = require('./get-unpublished-total')
const getActionsByCalculationId = require('./get-actions-by-calculation-id')

const getUnpublished = async (limit = 250, offset = 0, transaction) => {
  const totals = await getUnpublishedTotal(limit, offset, transaction)
  const grouped = {}

  for (const total of totals) {
    const actions = await getActionsByCalculationId(total.calculationId, transaction)
    if (!grouped[total.calculationId]) {
      grouped[total.calculationId] = { ...total, actions }
    } else {
      grouped[total.calculationId].actions = grouped[total.calculationId].actions.concat(actions)
      const seen = new Set()
      grouped[total.calculationId].actions = grouped[total.calculationId].actions.filter(action => {
        if (seen.has(action.actionId)) {
          return false
        }
        seen.add(action.actionId)
        return true
      })
    }
  }

  return Object.values(grouped)
}

module.exports = getUnpublished
