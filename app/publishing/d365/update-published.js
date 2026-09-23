const db = require('../../database')

const updateD365DatePublished = async (d365Id, transaction) => {
  await db.d365(transaction ?? undefined).where({ d365Id }).update({ datePublished: new Date() })
}

module.exports = updateD365DatePublished
