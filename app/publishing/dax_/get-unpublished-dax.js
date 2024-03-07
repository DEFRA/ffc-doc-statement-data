const db = require('../../data')
const { publishingConfig } = require('../../config')

const getUnpublishedDax = async (transaction) => {
  return db.dax.findAll({
    lock: true,
    skipLocked: true,
    limit: publishingConfig.dataPublishingMaxBatchSizePerDataSource,
    where: {
      [db.Sequelize.Op.or]: [
        {
          datePublished: null
        },
        {
          datePublished: { [db.Sequelize.Op.lt]: db.sequelize.col('datePublished') }
        }
      ]
    },
    attributes: ['paymentReference', 'calculationId', 'paymentPeriod', 'totalQuarterlyPayment', 'transDate', 'datePublished'],
    raw: true,
    transaction
  })
}

module.exports = getUnpublishedDax
