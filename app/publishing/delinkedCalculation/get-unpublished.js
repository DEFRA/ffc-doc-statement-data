const getUnpublishedDelinked = require('./get-unpublished-delinked')

const getUnpublished = async (transaction) => {
  const delinked = await getUnpublishedDelinked(transaction)

  const unpublished = []

  for (const item of delinked) {
    if (item.calculationReference) {
      unpublished.push({
        ...item,
        calculationId: item.calculationReference, // Map calculationReference to calculationId
        applicationId: item.applicationReference // Map applicationReference to applicationId
      })
    } else {
      console.error('Missing calculationReference for item: sbi=%s frn=%s applicationReference=%s', item.sbi, item.frn, item.applicationReference)
    }
  }

  return unpublished
}

module.exports = getUnpublished
