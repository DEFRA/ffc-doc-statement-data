const getUnpublishedDelinked = require('./get-unpublished-delinked')
const updatePublished = require('./update-published')

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
      console.error('Missing calculationReference for item:', item)
    }
  }

  for (const item of unpublished) {
    console.log('Updating item with calculationReference:', item.calculationReference)
    await updatePublished(item.calculationReference, transaction)
  }

  return unpublished
}

module.exports = getUnpublished
