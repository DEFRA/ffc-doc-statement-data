const { storageConfig } = require('../../config')
const { getEtlStageLogs, executeQuery } = require('./load-interm-utils')

const tablesToCheck = [
  storageConfig.organisation.folder,
  storageConfig.businessAddress.folder
]

const folderToAliasMap = {
  [storageConfig.organisation.folder]: 'O',
  [storageConfig.businessAddress.folder]: 'A'
}

const queryTemplate = (idFrom, idTo, tableAlias, exclusionCondition) => `
  WITH newData AS (
    SELECT
      O.sbi,
      A.businessAddress1 AS addressLine1,
      A.businessAddress2 AS addressLine2,
      A.businessAddress3 AS addressLine3,
      A.businessCity AS city,
      A.businessCounty AS county,
      A.businessPostCode AS postcode,
      A.businessEmailAddr AS emailaddress,
      A.frn,
      A.businessName AS name,
      O.lastUpdatedOn::date AS updated,
      O.partyId,
      ${tableAlias}.changeType
    FROM etlStageOrganisation O
    LEFT JOIN etlStageBusinessAddressContactV A ON A.sbi = O.sbi
    WHERE ${tableAlias}.etlId BETWEEN ${idFrom} AND ${idTo}
      ${exclusionCondition}
  ),
  updatedRows AS (
    UPDATE etlIntermOrg interm
    SET
      addressLine1 = newData.addressLine1,
      addressLine2 = newData.addressLine2,
      addressLine3 = newData.addressLine3,
      city = newData.city,
      county = newData.county,
      postcode = newData.postcode,
      emailaddress = newData.emailaddress,
      frn = newData.frn,
      sbi = newData.sbi,
      "name" = newData.name,
      updated = newData.updated,
      etlInsertedDt = NOW()
    FROM newData
    WHERE newData.changeType = 'UPDATE'
      AND interm.partyId = newData.partyId
    RETURNING interm.partyId
  )
  INSERT INTO etlIntermOrg (
    sbi,
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    county,
    postcode,
    emailaddress,
    frn,
    "name",
    partyId,
    updated
  )
  SELECT
    sbi,
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    county,
    postcode,
    emailaddress,
    frn,
    "name",
    partyId,
    updated
  FROM newData
  WHERE changeType = 'INSERT'
    OR (changeType = 'UPDATE' AND partyId NOT IN (SELECT partyId FROM updatedRows));
`

const loadIntermOrg = async (startDate, transaction) => {
  const etlStageLogs = await getEtlStageLogs(startDate, tablesToCheck)

  if (!etlStageLogs.length) {
    return
  }

  const batchSize = storageConfig.etlBatchSize
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
    exclusionScript += ` AND ${tableAlias}.etlId NOT BETWEEN ${log.idFrom} AND ${log.idTo}`
  }
}

module.exports = {
  loadIntermOrg
}
