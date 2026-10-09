const db = require('../../database')
const { publishingConfig } = require('../../config')

const getUnpublishedDelinked = async (transaction, limit = publishingConfig.dataPublishingMaxBatchSizePerDataSource) => {
  return db.delinkedCalculation(transaction ?? undefined)
    .whereNull('datePublished')
    .orWhereRaw('"datePublished" < "updated"')
    .select(
      { applicationReference: 'applicationId' },
      { calculationReference: 'calculationId' },
      'sbi',
      'frn',
      'paymentBand1',
      'paymentBand2',
      'paymentBand3',
      'paymentBand4',
      'percentageReduction1',
      'percentageReduction2',
      'percentageReduction3',
      'percentageReduction4',
      'progressiveReductions1',
      'progressiveReductions2',
      'progressiveReductions3',
      'progressiveReductions4',
      'referenceAmount',
      'totalProgressiveReduction',
      'totalDelinkedPayment',
      'paymentAmountCalculated',
      'datePublished',
      'updated'
    )
    .limit(limit)
    .forUpdate()
    .skipLocked()
}

module.exports = getUnpublishedDelinked
