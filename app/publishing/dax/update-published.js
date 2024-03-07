const db = require('../../data')

const updateDaxDatePublished = async (paymentReference, transaction) => {
  await db.dax.update({ datePublished: new Date() }, { where: { paymentReference }, transaction })
}

module.exports = updateDaxDatePublished
