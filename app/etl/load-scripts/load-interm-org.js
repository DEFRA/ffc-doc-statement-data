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
  WITH new_data AS (
    SELECT
      O.sbi,
      A.business_address1 AS addressLine1,
      A.business_address2 AS addressLine2,
      A.business_address3 AS addressLine3,
      A.business_city AS city,
      A.business_county AS county,
      A.business_post_code AS postcode,
      A.business_email_addr AS emailaddress,
      A.frn,
      A.business_name AS name,
      O.last_updated_on::date AS updated,
      O.party_id,
      ${tableAlias}.change_type
    FROM etl_stage_organisation O
    LEFT JOIN etl_stage_business_address_contact_v A ON A.sbi = O.sbi
    WHERE ${tableAlias}.etl_id BETWEEN ${idFrom} AND ${idTo}
      ${exclusionCondition}
  ),
  updated_rows AS (
    UPDATE etl_interm_org interm
    SET
      addressLine1 = new_data.addressLine1,
      addressLine2 = new_data.addressLine2,
      addressLine3 = new_data.addressLine3,
      city = new_data.city,
      county = new_data.county,
      postcode = new_data.postcode,
      emailaddress = new_data.emailaddress,
      frn = new_data.frn,
      sbi = new_data.sbi,
      "name" = new_data.name,
      updated = new_data.updated,
      etl_inserted_dt = NOW()
    FROM new_data
    WHERE new_data.change_type = 'UPDATE'
      AND interm.party_id = new_data.party_id
    RETURNING interm.party_id
  )
  INSERT INTO etl_interm_org (
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
    party_id,
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
    party_id,
    updated
  FROM new_data
  WHERE change_type = 'INSERT'
    OR (change_type = 'UPDATE' AND party_id NOT IN (SELECT party_id FROM updated_rows));
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

    for (let i = log.id_from; i <= log.id_to; i += batchSize) {
      console.log(`Processing org records for folder ${folder} ${i} - ${Math.min(i + batchSize - 1, log.id_to)}`)
      const query = queryTemplate(i, Math.min(i + batchSize - 1, log.id_to), tableAlias, exclusionScript)
      await executeQuery(query, {}, transaction)
    }

    console.log(`Processed org records for folder ${folder}`)
    exclusionScript += ` AND ${tableAlias}.etl_id NOT BETWEEN ${log.id_from} AND ${log.id_to}`
  }
}

module.exports = {
  loadIntermOrg
}
