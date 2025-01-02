const { storageConfig } = require('../../config')
const { getEtlStageLogs, executeQuery } = require('./load-interm-utils')

const loadIntermApplicationClaim = async (startDate, transaction) => {
  const etlStageLog = await getEtlStageLogs(startDate, storageConfig.cssContractApplications.folder)
  if (!etlStageLog) return

  const query = `
    WITH new_data AS (
      SELECT
        cc.contract_id,
        ca.application_id AS claim_id,
        ca.application_id AS agreement_id,
        cl.change_type,
        cl.pkid
      FROM etl_stage_css_contract_applications cl
      LEFT JOIN etl_stage_css_contract_applications ca ON cl.contract_id = ca.contract_id AND ca.data_source_s_code = '000001'
      LEFT JOIN etl_stage_css_contracts cc ON cl.contract_id = cc.contract_id
      WHERE cl.data_source_s_code = 'CAPCLM'
        AND cl.etl_id BETWEEN :idFrom AND :idTo
      GROUP BY cc.contract_id, cc.start_dt, cc.end_dt, ca.application_id, cl.change_type, cl.pkid
    ),
    updated_rows AS (
      UPDATE etl_interm_application_claim interm
      SET
        contract_id = new_data.contract_id,
        claim_id = new_data.claim_id,
        agreement_id = new_data.agreement_id,
        etl_inserted_dt = NOW()
      FROM new_data
      WHERE new_data.change_type = 'UPDATE'
        AND interm.pkid = new_data.pkid
      RETURNING interm.pkid
    )
    INSERT INTO etl_interm_application_claim (
      contract_id, claim_id, agreement_id, pkid
    )
    SELECT contract_id, claim_id, agreement_id, pkid
    FROM new_data
    WHERE change_type = 'INSERT'
      OR (change_type = 'UPDATE' AND pkid NOT IN (SELECT pkid FROM updated_rows));
  `

  await executeQuery(query, {
    idFrom: etlStageLog.id_from,
    idTo: etlStageLog.id_to
  }, transaction)
}

module.exports = {
  loadIntermApplicationClaim
}
