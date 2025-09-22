const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const mqConfig = require('../../config/message')
const { executeQuery } = require('./load-interm-utils')

const loadOrganisations = async (startDate, transaction) => {
  const query = `
  -- Upsert query for organisations table based on sbi
  WITH upsert AS (
    SELECT DISTINCT ON (sbi)
      sbi, "addressLine1", "addressLine2",
      "addressLine3", city, county,
      SUBSTRING(postcode, 1, 8) AS postcode, "emailAddress", frn::integer,
      "name", NOW() AS updated
    FROM ${dbConfig.schema}."etlIntermOrg" O
    WHERE O."etlInsertedDt" > :startDate
    ORDER BY sbi, "etlInsertedDt" DESC
  )
  INSERT INTO ${dbConfig.schema}.organisations (
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
  ON CONFLICT (sbi) DO UPDATE SET
    "addressLine1" = EXCLUDED."addressLine1",
    "addressLine2" = EXCLUDED."addressLine2",
    "addressLine3" = EXCLUDED."addressLine3",
    city = EXCLUDED.city,
    county = EXCLUDED.county,
    postcode = EXCLUDED.postcode,
    "emailAddress" = EXCLUDED."emailAddress",
    frn = EXCLUDED.frn,
    "name" = EXCLUDED."name",
    updated = EXCLUDED.updated;
  `
  if (!mqConfig.day0DateTime) {
    await executeQuery(query, {
      startDate
    }, transaction)
  } else {
    console.log('Skipping organisation load as a day 0 cut has been loaded')
  }
}

module.exports = {
  loadOrganisations
}
