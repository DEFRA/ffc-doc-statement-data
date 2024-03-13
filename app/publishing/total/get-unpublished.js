const getUnpublishedTotal = require('./get-unpublished-total')
const getActionsByCalculationId = require('./get-actions-by-calculation-id')

const getUnpublished = async (transaction) => {
  const totals = await getUnpublishedTotal(transaction)

  const unpublished = []

  for (const total of totals) {
    const actions = await getActionsByCalculationId(total.calculationId, transaction)
    unpublished.push({
      ...total,
      actions
    })
  }

  return unpublished
}

module.exports = getUnpublished
