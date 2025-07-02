const db = require('../../data')

const updateSubsetCheck = async (scheme, subsetSent = true) => {
  return db.subsetCheck.update({
    subsetSent
  }, {
    where: {
      scheme
    }
  })
}

module.exports = updateSubsetCheck
