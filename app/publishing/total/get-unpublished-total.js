const db = require('../../data')
const { publishingConfig } = require('../../config')

const getUnpublishedTotal = async (transaction, limit = publishingConfig.dataPublishingMaxBatchSizePerDataSource) => {
  return db.total(transaction ?? undefined)
    .select('calculationId', { calculationReference: 'calculationId' }, { totalsId: 'calculationId' }, 'sbi', 'frn', 'agreementNumber', 'claimId', { claimReference: 'claimId' }, 'schemeType', 'calculationDate', 'invoiceNumber', 'agreementStart', 'agreementEnd', 'totalAdditionalPayments', 'totalActionPayments', 'totalPayments', 'updated', 'datePublished')
    .whereNull('datePublished')
    .orWhereRaw('"datePublished" < "updated"')
    .limit(limit)
    .forUpdate()
    .skipLocked()
}

module.exports = getUnpublishedTotal
