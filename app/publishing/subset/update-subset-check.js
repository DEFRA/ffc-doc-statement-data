const db = require('../../data')

const updateSubsetCheck = async (scheme, subsetSent = true) => {
  return db.subsetCheck().where({ scheme }).update({ subsetSent })
}

module.exports = updateSubsetCheck
