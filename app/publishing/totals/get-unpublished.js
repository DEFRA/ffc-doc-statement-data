const getUnpublishedTotals = require('./get-unpublished-totals')
const getActionsByCalculationId = require('./get-actions-by-calculation-id')

const getUnpublished = async (transaction) => {
  const totals = await getUnpublishedTotals(transaction)

  const unpublished = []

  for (const total of totals) {
    const actions = await getActionsByCalculationId(total.calculationReference, transaction)
    unpublished.push({
      ...total,
      actions
    })
  }

  return unpublished
}

module.exports = getUnpublished
