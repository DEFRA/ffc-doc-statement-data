const db = require('../../data')
const { publishingConfig } = require('../../config')

const getUnpublishedD365 = async (transaction, limit = publishingConfig.dataPublishingMaxBatchSizePerDataSource) => {
  return db.d365.findAll({
    lock: true,
    skipLocked: true,
    where: {
      [db.Sequelize.Op.or]: [
        {
          datePublished: null
        }
      ]
    },
    attributes: ['d365Id', 'paymentReference', ['calculationId', 'calculationReference'], 'paymentPeriod', 'paymentAmount', 'marketingYear', 'transactionDate'],
    raw: true,
    transaction,
    limit
  })
}

module.exports = getUnpublishedD365
