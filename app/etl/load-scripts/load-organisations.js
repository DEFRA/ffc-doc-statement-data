const db = require('../../data')

const loadOrganisations = async (startDate, transaction) => {
  await db.sequelize.query(`
    INSERT INTO organisations (
      sbi, "addressLine1", "addressLine2",
      "addressLine3", city, county,
      postcode, "emailAddress", frn,
      "name", updated
      )
    SELECT
      sbi, addressLine1, addressLine2,
      addressLine3, city, county,
      SUBSTRING(postcode,1,7), emailAddress, frn::integer,
      "name", NOW()
    FROM etl_interm_org O
    WHERE O.etl_inserted_dt > :startDate;
  `, {
    replacements: {
      startDate
    },
    raw: true,
    transaction
  })
}

module.exports = {
  loadOrganisations
}
