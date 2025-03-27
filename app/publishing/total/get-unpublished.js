const getUnpublishedTotal = require('./get-unpublished-total')
const getActionsByCalculationId = require('./get-actions-by-calculation-id')
const { publishingConfig } = require('../../config')

const getUnpublished = async (transaction, limit = publishingConfig.dataPublishingMaxBatchSizePerDataSource) => {
  const totals = await getUnpublishedTotal(transaction, limit)
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
