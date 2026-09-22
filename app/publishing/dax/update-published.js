const db = require('../../database')

const updateDaxDatePublished = async (daxId, transaction) => {
  await db.dax(transaction ?? undefined).where({ daxId }).update({ datePublished: new Date() })
}

module.exports = updateDaxDatePublished
