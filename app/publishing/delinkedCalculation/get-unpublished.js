const getUnpublishedTotal = require('./get-unpublished-total')

const getUnpublished = async (transaction) => {
  const totals = await getUnpublishedTotal(transaction)

  return totals
}

module.exports = getUnpublished
