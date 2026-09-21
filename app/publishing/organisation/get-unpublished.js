const db = require('../../data')
const { publishingConfig } = require('../../config')

const getUnpublished = async (transaction, limit = publishingConfig.dataPublishingMaxBatchSizePerDataSource) => {
  return db.organisation(transaction ?? undefined)
    .whereNull('published')
    .orWhereRaw('"published" < "updated"')
    .select('sbi', 'addressLine1', 'addressLine2', 'addressLine3', 'city', 'county', 'postcode', 'emailAddress', 'frn', 'name', 'updated')
    .limit(limit)
    .forUpdate()
    .skipLocked()
}

module.exports = getUnpublished
