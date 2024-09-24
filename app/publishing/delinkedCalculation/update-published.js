const db = require('../../data')

const updatePublished = async (calculationReference, transaction) => {
  await db.delinkedCalculation.update({ datePublished: new Date() }, { where: { calculationId: calculationReference }, transaction })
}

module.exports = updatePublished
