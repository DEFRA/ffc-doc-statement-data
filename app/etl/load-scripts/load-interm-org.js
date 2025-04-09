const config = require('../../config')
const etlConfig = config.etlConfig
const dbConfig = config.dbConfig[config.env]
const { getEtlStageLogs, executeQuery } = require('./load-interm-utils')

const tablesToCheck = [
  etlConfig.organisation.folder,
  etlConfig.businessAddress.folder
]

const folderToAliasMap = {
  [etlConfig.organisation.folder]: 'O',
  [etlConfig.businessAddress.folder]: 'A'
}

const queryTemplate = (idFrom, idTo, tableAlias, exclusionCondition) => `
  WITH newdata AS (
    SELECT
      O.sbi,
      A."businessAddress1" AS "addressLine1",
      A."businessAddress2" AS "addressLine2",
      A."businessAddress3" AS "addressLine3",
      A."businessCity" AS city,
      A."businessCounty" AS county,
      A."businessPostCode" AS postcode,
      A."businessEmailAddr" AS emailaddress,
      A.frn,
      A."businessName" AS name,
      O."lastUpdatedOn"::date AS updated,
      O."partyId",
      ${tableAlias}."changeType"
    FROM ${dbConfig.schema}."etlStageOrganisation" O
    LEFT JOIN ${dbConfig.schema}."etlStageBusinessAddressContactV" A ON A.sbi = O.sbi
    WHERE ${tableAlias}."etlId" BETWEEN ${idFrom} AND ${idTo}
      ${exclusionCondition}
  ),
  updatedrows AS (
    UPDATE ${dbConfig.schema}."etlIntermOrg" interm
    SET
      "addressLine1" = newdata."addressLine1",
      "addressLine2" = newdata."addressLine2",
      "addressLine3" = newdata."addressLine3",
      city = newdata.city,
      county = newdata.county,
      postcode = newdata.postcode,
      "emailAddress" = newdata.emailaddress,
      frn = newdata.frn,
      sbi = newdata.sbi,
      "name" = newdata.name,
      updated = newdata.updated,
      "etlInsertedDt" = NOW()
    FROM newdata
    WHERE newdata."changeType" = 'UPDATE'
      AND interm."partyId" = newdata."partyId"
    RETURNING interm."partyId"
  )
  INSERT INTO ${dbConfig.schema}."etlIntermOrg" (
    sbi,
    "addressLine1",
    "addressLine2",
    "addressLine3",
    city,
    county,
    postcode,
    emailaddress,
    frn,
    "name",
    "partyId",
    updated
  )
  SELECT
    sbi,
    "addressLine1",
    "addressLine2",
    "addressLine3",
    city,
    county,
    postcode,
    emailaddress,
    frn,
    "name",
    "partyId",
    updated
  FROM newdata
  WHERE "changeType" = 'INSERT'
    OR ("changeType" = 'UPDATE' AND "partyId" NOT IN (SELECT "partyId" FROM updatedrows));
`

const loadIntermOrg = async (startDate, transaction) => {
  const etlStageLogs = await getEtlStageLogs(startDate, tablesToCheck)

  if (!etlStageLogs.length) {
    return
  }

  const batchSize = etlConfig.etlBatchSize
  let exclusionScript = ''
  for (const log of etlStageLogs) {
    const folderMatch = log.file.match(/^(.*)\/export\.csv$/)
    const folder = folderMatch ? folderMatch[1] : ''
    const tableAlias = folderToAliasMap[folder]

    for (let i = log.idFrom; i <= log.idTo; i += batchSize) {
      console.log(`Processing org records for folder ${folder} ${i} - ${Math.min(i + batchSize - 1, log.idTo)}`)
      const query = queryTemplate(i, Math.min(i + batchSize - 1, log.idTo), tableAlias, exclusionScript)
      await executeQuery(query, {}, transaction)
    }

    console.log(`Processed org records for folder ${folder}`)
    exclusionScript += ` AND ${tableAlias}."etlId" NOT BETWEEN ${log.idFrom} AND ${log.idTo}`
  }
}

module.exports = {
  loadIntermOrg
}
