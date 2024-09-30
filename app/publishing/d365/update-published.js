const db = require('../../data')

const updateD365DatePublished = async (paymentReference, transaction) => {
  await db.d365.update({ datePublished: new Date() }, { where: { paymentReference }, transaction })
}

module.exports = updateD365DatePublished
