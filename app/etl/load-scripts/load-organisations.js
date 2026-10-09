const config = require('../../config')
const TABLES = { ...require('../../constants/etl-tables'), ...require('../../constants/tables') }
const dbConfig = config.dbConfig[config.env]
const { executeQuery } = require('./load-interm-utils')

const loadOrganisations = async (startDate, transaction) => {
  const query = `
    WITH upsert AS (
      SELECT DISTINCT ON (sbi)
        sbi, "addressLine1", "addressLine2",
        "addressLine3", city, county,
        SUBSTRING(postcode, 1, 8) AS postcode, "emailAddress", frn::integer,
        "name", NOW() AS updated
      FROM ${dbConfig.schema}."${TABLES.etlIntermOrg}" O
      WHERE O."etlInsertedDt" > :startDate
      ORDER BY sbi, "etlInsertedDt" DESC
    )
    INSERT INTO ${dbConfig.schema}.${TABLES.organisation} (
      sbi, "addressLine1", "addressLine2",
      "addressLine3", city, county,
      postcode, "emailAddress", frn,
      "name", updated
    )
    SELECT
      upsert.sbi, upsert."addressLine1", upsert."addressLine2",
      upsert."addressLine3", upsert.city, upsert.county,
      upsert.postcode, upsert."emailAddress", upsert.frn,
      upsert."name", upsert.updated
    FROM upsert
    ON CONFLICT (sbi) DO NOTHING
  `

  await executeQuery(query, { startDate }, transaction)
}

module.exports = {
  loadOrganisations
}
