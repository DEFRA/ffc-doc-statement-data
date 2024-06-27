const db = require('../../data')
const { publishingConfig } = require('../../config')

const getUnpublishedDelinked = async (transaction) => {
  return db.delinkedCalculation.findAll({
    lock: true,
    skipLocked: true,
    limit: publishingConfig.dataPublishingMaxBatchSizePerDataSource,
    attributes: [
      'applicationId',
      'calculationId',
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
      'paymentAmountCalculated'
    ],
    raw: true,
    transaction
  })
}

module.exports = getUnpublishedDelinked
