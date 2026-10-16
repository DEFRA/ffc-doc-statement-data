const db = require('../../database')

const getSubsetOrganisations = async (sbiArray) => {
  return db.organisations()
    .whereIn('sbi', sbiArray)
    .where(function () {
      this.whereNull('published').orWhereRaw('"published" < "updated"')
    })
    .select('sbi', 'addressLine1', 'addressLine2', 'addressLine3', 'city', 'county', 'postcode', 'emailAddress', 'frn', 'name', 'updated')
    .forUpdate()
    .skipLocked()
}

module.exports = getSubsetOrganisations
