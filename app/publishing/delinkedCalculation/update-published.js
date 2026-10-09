const db = require('../../database')

const updatePublished = async (calculationId, transaction) => {
  await db.delinkedCalculation(transaction ?? undefined)
    .where({ calculationId })
    .update({ datePublished: new Date() })
}

module.exports = updatePublished
