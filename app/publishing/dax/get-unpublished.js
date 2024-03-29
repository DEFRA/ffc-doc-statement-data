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
        }
      ]
    },
    attributes: ['paymentReference', ['calculationId', 'calculationReference'], 'paymentPeriod', 'paymentAmount', 'transactionDate'],
    raw: true,
    transaction
  })
}

module.exports = getUnpublishedDax
