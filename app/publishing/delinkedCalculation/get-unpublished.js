const getUnpublishedDelinked = require('./get-unpublished-delinked')

const getUnpublished = async (transaction) => {
  try {
    const delinked = await getUnpublishedDelinked(transaction)
    return delinked
  } catch (error) {
    console.error('Error in getUnpublished:', error) // Error logging
    throw error // Rethrow or handle as needed
  }
}

module.exports = getUnpublished
