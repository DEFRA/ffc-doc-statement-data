const db = require('../../data')

const getSubsetOrganisations = async (sbiArray) => {
  return db.organisation()
    .whereIn('sbi', sbiArray)
    .where(function () {
      this.whereNull('published').orWhereRaw('"published" < "updated"')
    })
    .select('sbi', 'addressLine1', 'addressLine2', 'addressLine3', 'city', 'county', 'postcode', 'emailAddress', 'frn', 'name', 'updated')
}

module.exports = getSubsetOrganisations
