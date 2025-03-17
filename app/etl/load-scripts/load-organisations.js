const { executeQuery } = require('./load-interm-utils')

const loadOrganisations = async (startDate, transaction) => {
  const query = `
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
    FROM etlIntermOrg O
    WHERE O.etlInsertedDt > :startDate;
  `

  await executeQuery(query, {
    startDate
  }, transaction)
}

module.exports = {
  loadOrganisations
}
