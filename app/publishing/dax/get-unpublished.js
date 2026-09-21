const db = require('../../data')
const { publishingConfig } = require('../../config')

const getUnpublishedDax = async (transaction, limit = publishingConfig.dataPublishingMaxBatchSizePerDataSource) => {
  return db.dax(transaction ?? undefined)
    .whereNull('datePublished')
    .select('daxId', 'paymentReference', { calculationReference: 'calculationId' }, 'paymentPeriod', 'paymentAmount', 'transactionDate')
    .limit(limit)
    .forUpdate()
    .skipLocked()
}

module.exports = getUnpublishedDax
