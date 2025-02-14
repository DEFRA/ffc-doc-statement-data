const db = require('../../data')

const updateDaxDatePublished = async (daxId, transaction) => {
  await db.dax.update({ datePublished: new Date() }, { where: { daxId }, transaction })
}

module.exports = updateDaxDatePublished
