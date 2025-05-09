const config = require('../../config')
const etlConfig = config.etlConfig
const dbConfig = config.dbConfig[config.env]
const { getEtlStageLogs, processWithWorkers } = require('./load-interm-utils')

const defaultTablesToCheck = [
  etlConfig.organisation.folder,
  etlConfig.businessAddress.folder
]

const defaultFolderToAliasMap = {
  [etlConfig.organisation.folder]: 'O',
  [etlConfig.businessAddress.folder]: 'A'
}

const queryTemplate = (idFrom, idTo, tableAlias, exclusionCondition) => `
  WITH "newData" AS (
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
      O."lastUpdatedOn"::date AS "updated",
      O."partyId",
      ${tableAlias}."changeType"
    FROM ${dbConfig.schema}."etlStageOrganisation" O
    INNER JOIN ${dbConfig.schema}."etlStageBusinessAddressContactV" A ON A.sbi = O.sbi
    WHERE ${tableAlias}."etlId" BETWEEN ${idFrom} AND ${idTo}
      ${exclusionCondition}
  ),
  "updatedrows" AS (
    UPDATE ${dbConfig.schema}."etlIntermOrg" interm
    SET
      "addressLine1" = "newData"."addressLine1",
      "addressLine2" = "newData"."addressLine2",
      "addressLine3" = "newData"."addressLine3",
      city = "newData".city,
      county = "newData".county,
      postcode = "newData".postcode,
      "emailAddress" = "newData"."emailAddress",
      frn = "newData".frn,
      sbi = "newData".sbi,
      "name" = "newData".name,
      updated = "newData".updated,
      "etlInsertedDt" = NOW()
    FROM "newData"
    WHERE "newData"."changeType" = 'UPDATE'
      AND interm."partyId" = "newData"."partyId"
    RETURNING interm."partyId"
  )
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
    sbi,
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
  FROM "newData"
  WHERE "changeType" = 'INSERT'
    OR ("changeType" = 'UPDATE' AND "partyId" NOT IN (SELECT "partyId" FROM updatedrows));
`

const loadIntermOrg = async (startDate, transaction, tablesToCheck = defaultTablesToCheck, folderToAliasMap = defaultFolderToAliasMap) => {
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

    await processWithWorkers({ query: null, batchSize, idFrom: log.idFrom, idTo: log.idTo, transaction, recordType: `org records for folder ${folder}`, queryTemplate, exclusionScript, tableAlias })

    console.log(`Processed org records for folder ${folder}`)
    exclusionScript += ` AND ${tableAlias}."etlId" NOT BETWEEN ${log.idFrom} AND ${log.idTo}`
  }
}

const loadIntermOrgDelinked = async (startDate, transaction) => {
  const tablesToCheck = [
    etlConfig.organisationDelinked.folder
  ]

  const folderToAliasMap = {
    [etlConfig.organisationDelinked.folder]: 'O',
    [etlConfig.businessAddressDelinked.folder]: 'A'
  }

  return loadIntermOrg(startDate, transaction, tablesToCheck, folderToAliasMap)
}

module.exports = {
  loadIntermOrg,
  loadIntermOrgDelinked
}
