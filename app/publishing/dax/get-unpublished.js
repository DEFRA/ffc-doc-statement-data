const db = require('../../data')

const getUnpublishedDax = async (transaction) => {
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
    transaction
  })
}

module.exports = getUnpublishedDax
