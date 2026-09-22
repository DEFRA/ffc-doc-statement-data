const db = require('../../database')
const { publishingConfig } = require('../../config')

const getUnpublishedD365 = async (transaction, limit = publishingConfig.dataPublishingMaxBatchSizePerDataSource, randomise = false) => {
  const query = db.d365(transaction ?? undefined)
    .whereNull('datePublished')
    .select('d365Id', 'paymentReference', { calculationReference: 'calculationId' }, 'paymentPeriod', 'marketingYear', 'paymentAmount', 'transactionDate')
    .limit(limit)
    .forUpdate()
    .skipLocked()

  if (randomise) {
    query.orderByRaw('random()')
  }

  return query
}

module.exports = getUnpublishedD365
