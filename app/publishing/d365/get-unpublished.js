const db = require('../../data')
const { publishingConfig } = require('../../config')

const getUnpublishedD365 = async (transaction, limit = publishingConfig.dataPublishingMaxBatchSizePerDataSource, randomise = false) => {
  const query = {
    lock: true,
    skipLocked: true,
    where: {
      datePublished: null
    },
    attributes: ['d365Id', 'paymentReference', ['calculationId', 'calculationReference'], 'paymentPeriod', 'marketingYear', 'paymentAmount', 'transactionDate'],
    raw: true,
    transaction,
    limit
  }

  if (randomise) {
    query.order = db.sequelize.literal('random()')
  }

  return db.d365.findAll(query)
}

module.exports = getUnpublishedD365
