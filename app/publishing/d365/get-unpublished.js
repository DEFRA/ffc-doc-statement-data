const db = require('../../data')

const getUnpublishedD365 = async (transaction) => {
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
    attributes: ['d365Id', 'paymentReference', ['calculationId', 'calculationReference'], 'paymentPeriod', 'paymentAmount', 'transactionDate'],
    raw: true,
    transaction
  })
}

module.exports = getUnpublishedD365
