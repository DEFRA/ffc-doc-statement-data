const getUnpublishedDelinked = require('./get-unpublished-delinked')

const getUnpublished = async (transaction) => {
  const delinked = await getUnpublishedDelinked(transaction)

  const unpublished = []

  for (const item of delinked) {
    unpublished.push({
      ...item,
      calculationId: item.calculationId
    })
  }

  return unpublished
}

module.exports = getUnpublished
