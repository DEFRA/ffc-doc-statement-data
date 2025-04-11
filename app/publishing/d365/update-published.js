const db = require('../../data')

const updateD365DatePublished = async (d365Id, transaction) => {
  await db.d365.update({ datePublished: new Date() }, { where: { d365Id }, transaction })
}

module.exports = updateD365DatePublished
