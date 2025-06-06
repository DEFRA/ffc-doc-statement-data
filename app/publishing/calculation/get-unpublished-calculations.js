const db = require('../../data')
const { publishingConfig } = require('../../config')

const getUnpublishedCalculations = async (transaction, limit = publishingConfig.dataPublishingMaxBatchSizePerDataSource) => {
  return db.calculation.findAll({
    lock: true,
    skipLocked: true,
    where: {
      [db.Sequelize.Op.or]: [
        {
          published: null
        },
        {
          published: { [db.Sequelize.Op.lt]: db.sequelize.col('updated') }
        }
      ]
    },
    attributes: ['calculationId', ['calculationId', 'calculationReference'], 'sbi', 'frn', 'calculationDate', 'invoiceNumber', 'scheme', 'updated'],
    raw: true,
    transaction,
    limit
  })
}

module.exports = getUnpublishedCalculations
