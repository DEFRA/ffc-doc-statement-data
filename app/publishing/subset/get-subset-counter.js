const db = require('../../data')

const getSubsetCounter = async (scheme) => {
  return db.subsetCounter.findAll({
    lock: true,
    skipLocked: true,
    raw: true,
    where: {
      scheme
    }
  })
}

module.exports = getSubsetCounter
