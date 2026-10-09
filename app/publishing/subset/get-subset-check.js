const db = require('../../database')

const getSubsetCheck = async (scheme) => {
  return (await db.subsetCheck().where({ scheme }).forUpdate().skipLocked().first()) ?? null
}

module.exports = getSubsetCheck
