const db = require('../../data')
const { publishingConfig } = require('../../config')

const getUnpublishedTotals = async (transaction) => {
  return db.total.findAll({
    lock: true,
    skipLocked: true,
    limit: publishingConfig.dataPublishingMaxBatchSizePerDataSource,
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
    attributes: ['calculationId', ['calculationId', 'totalReference'], 'sbi', 'frn', 'agreementNumber', 'claimId', ['claimId', 'idClaim'], 'schemeType', 'calculationDate', 'invoiceNumber', 'agreementStart', 'agreementEnd', 'totalAdditionalPayments', 'totalActionPayments', 'totalPayments', 'updated', 'datePublished'],
    raw: true,
    transaction
  })
}

module.exports = getUnpublishedTotals
