const db = require('../../data')

const updatePublished = async (calculationId, transaction) => {
  await db.total(transaction ?? undefined).where({ calculationId }).update({ datePublished: new Date() })
}

module.exports = updatePublished
