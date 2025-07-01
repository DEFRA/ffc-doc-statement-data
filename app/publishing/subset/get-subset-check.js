const db = require('../../data')

const getSubsetCheck = async (scheme) => {
  return db.subsetCheck.findAll({
    lock: true,
    skipLocked: true,
    raw: true,
    where: {
      scheme
    }
  })
}

module.exports = getSubsetCheck
