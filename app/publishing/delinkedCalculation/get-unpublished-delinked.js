const db = require('../../data')
const { publishingConfig } = require('../../config')

const getUnpublishedDelinked = async (transaction) => {
  return db.delinkedCalculation.findAll({
    lock: true,
    skipLocked: true,
    where: {
      [db.Sequelize.Op.or]: [
        {
          datePublished: null
        },
        {
          datePublished: { [db.Sequelize.Op.lt]: db.sequelize.col('updated') }
        }
      ]
    },
    attributes: [
      ['applicationId', 'applicationReference'],
      ['calculationId', 'calculationReference'],
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
    ],
    raw: true,
    transaction
  })
}

module.exports = getUnpublishedDelinked
