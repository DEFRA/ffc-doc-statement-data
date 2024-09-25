const db = require('../../data')

const updatePublished = async (calculationId, transaction) => {
  if (!calculationId) {
    throw new Error('calculationId is required')
  }
  await db.delinkedCalculation.update({ datePublished: new Date() }, { where: { calculationId }, transaction })
}

module.exports = updatePublished
