const getUnpublishedDelinked = require('./get-unpublished-delinked')

const getUnpublished = async (transaction) => {
  const delinked = await getUnpublishedDelinked(transaction)
  return delinked
}

module.exports = getUnpublished
