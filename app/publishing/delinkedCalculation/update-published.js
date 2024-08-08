const db = require('../../data')

const updatePublished = async (calculationId, transaction) => {
  await db.delinkedCalculation.update({ datePublished: new Date() }, { where: { calculationId }, transaction })
}

module.exports = updatePublished
