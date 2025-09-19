const config = require('../../config')
const db = require('../../data')
const etlConfig = config.etlConfig
const dbConfig = config.dbConfig[config.env]
const { getEtlStageLogs } = require('./load-interm-utils')

const tablesToCheck = [
  etlConfig.day0Organisation.folder,
  etlConfig.day0BusinessAddress.folder
]

const queryTemplate = `
  TRUNCATE TABLE ${dbConfig.schema}."etlIntermOrg" CASCADE;
  INSERT INTO ${dbConfig.schema}."etlIntermOrg" (
    "sbi",
    "addressLine1",
    "addressLine2",
    "addressLine3",
    city,
    county,
    postcode,
    "emailAddress",
    frn,
    "name",
    "partyId",
    updated
  )
  SELECT
    O."sbi",
    A."businessAddress1" AS "addressLine1",
    A."businessAddress2" AS "addressLine2",
    A."businessAddress3" AS "addressLine3",
    A."businessCity" AS "city",
    A."businessCounty" AS "county",
    A."businessPostCode" AS "postcode",
    A."businessEmailAddr" AS "emailAddress",
    A."frn",
    A."businessName" AS "name",
    O."partyId",
    O."lastUpdatedOn"::date AS "updated"
    FROM ${dbConfig.schema}."etlStageDay0Organisation" O
    INNER JOIN ${dbConfig.schema}."etlStageDay0BusinessAddressContactV" A ON A.sbi = O.sbi
    WHERE O."sbi" IS NOT NULL;
`

const loadIntermOrgFromDay0 = async (startDate, transaction) => {
  const etlStageLogs = await getEtlStageLogs(startDate, tablesToCheck)

  if (!etlStageLogs.length) {
    return false
  }

  await db.sequelize.query(queryTemplate, {
    raw: true,
    transaction
  })

  console.log('Loaded intermediate data for Day 0 Organisations')
  return true
}

module.exports = {
  loadIntermOrgFromDay0
}
