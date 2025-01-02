const { storageConfig } = require('../../config')
const { getEtlStageLogs, executeQuery } = require('./load-interm-utils')

const loadIntermOrg = async (startDate, transaction) => {
  const etlStageLog = await getEtlStageLogs(startDate, storageConfig.organisation.folder)

  if (!etlStageLog) return

  const query = `
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
        O.change_type,
        O.party_id
      FROM etl_stage_organisation O
      LEFT JOIN etl_stage_business_address_contact_v A ON A.sbi = O.sbi
      WHERE O.etl_id BETWEEN :idFrom AND :idTo
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

  await executeQuery(query, {
    idFrom: etlStageLog.id_from,
    idTo: etlStageLog.id_to
  }, transaction)
}

module.exports = {
  loadIntermOrg
}
