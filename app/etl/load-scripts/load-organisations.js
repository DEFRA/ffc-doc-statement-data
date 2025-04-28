const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const { executeQuery } = require('./load-interm-utils')

const loadOrganisations = async (startDate, transaction) => {
  const query = `
    INSERT INTO ${dbConfig.schema}.organisations (
      sbi, "addressLine1", "addressLine2",
      "addressLine3", city, county,
      postcode, "emailAddress", frn,
      "name", updated
    )
    SELECT DISTINCT ON (sbi)
      sbi, "addressLine1", "addressLine2",
      "addressLine3", city, county,
      SUBSTRING(postcode, 1, 7), "emailAddress", frn::integer,
      "name", NOW()
    FROM ${dbConfig.schema}."etlIntermOrg" O
    WHERE O."etlInsertedDt" > :startDate
    ORDER BY sbi, "etlInsertedDt" DESC;
  `

  await executeQuery(query, {
    startDate
  }, transaction)
}

module.exports = {
  loadOrganisations
}
