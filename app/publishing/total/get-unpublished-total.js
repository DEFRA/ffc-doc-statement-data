const db = require('../../data')

const getUnpublishedTotal = async (transaction, limit = 250, offset = 0) => {
  return db.total.findAll({
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
    attributes: ['calculationId', ['calculationId', 'calculationReference'], ['calculationId', 'totalsId'], 'sbi', 'frn', 'agreementNumber', 'claimId', ['claimId', 'claimReference'], 'schemeType', 'calculationDate', 'invoiceNumber', 'agreementStart', 'agreementEnd', 'totalAdditionalPayments', 'totalActionPayments', 'totalPayments', 'updated', 'datePublished'],
    raw: true,
    limit,
    offset,
    transaction
  })
}

module.exports = getUnpublishedTotal
