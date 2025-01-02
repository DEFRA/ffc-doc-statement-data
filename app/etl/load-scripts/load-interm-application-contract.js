const { storageConfig } = require('../../config')
const { getEtlStageLogs, executeQuery } = require('./load-interm-utils')

const loadIntermApplicationContract = async (startDate, transaction) => {
  const etlStageLog = await getEtlStageLogs(startDate, storageConfig.cssContractApplications.folder)
  if (!etlStageLog) return

  const query = `
    WITH new_data AS (
      SELECT
        cc.contract_id,
        MIN(cc.start_dt) AS agreementStart,
        MIN(cc.end_dt) AS agreementEnd,
        ca.application_id,
        cl.change_type,
        cl.pkid
      FROM etl_stage_css_contract_applications cl
      LEFT JOIN etl_stage_css_contract_applications ca ON cl.contract_id = ca.contract_id AND ca.data_source_s_code = '000001'
      LEFT JOIN etl_stage_css_contracts cc ON cl.contract_id = cc.contract_id AND cc.contract_state_s_code = '000020'
      WHERE cl.data_source_s_code = 'CAPCLM'
        AND cl.etl_id BETWEEN :idFrom AND :idTo
      GROUP BY cc.contract_id, ca.application_id, cl.change_type, cl.pkid
    ),
    updated_rows AS (
      UPDATE etl_interm_application_contract interm
      SET
        contract_id = new_data.contract_id,
        agreementStart = new_data.agreementStart,
        agreementEnd = new_data.agreementEnd,
        application_id = new_data.application_id,
        etl_inserted_dt = NOW()
      FROM new_data
      WHERE new_data.change_type = 'UPDATE'
        AND interm.pkid = new_data.pkid
      RETURNING interm.pkid
    )
    INSERT INTO etl_interm_application_contract (
      contract_id, agreementStart, agreementEnd, application_id, pkid
    )
    SELECT contract_id, agreementStart, agreementEnd, application_id, pkid
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
  loadIntermApplicationContract
}
