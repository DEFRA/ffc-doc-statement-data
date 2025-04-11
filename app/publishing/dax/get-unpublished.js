const db = require('../../data')
const { publishingConfig } = require('../../config')

const getUnpublishedDax = async (transaction, limit = publishingConfig.dataPublishingMaxBatchSizePerDataSource) => {
  return db.dax.findAll({
    lock: true,
    skipLocked: true,
    where: {
      [db.Sequelize.Op.or]: [
        {
          datePublished: null
        }
      ]
    },
    attributes: ['daxId', 'paymentReference', ['calculationId', 'calculationReference'], 'paymentPeriod', 'paymentAmount', 'transactionDate'],
    raw: true,
    transaction,
    limit
  })
}

module.exports = getUnpublishedDax
