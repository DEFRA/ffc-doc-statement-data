const { storageConfig } = require('../../config')
const db = require('../../data')

const loadIntermApplicationContract = async (startDate, transaction) => {
  const etlStageLogs = await db.etlStageLog.findAll({
    where: {
      file: `${storageConfig.cssContractApplications.folder}/export.csv`,
      ended_at: {
        [db.Sequelize.Op.gt]: startDate
      }
    }
  })

  if (etlStageLogs.length > 1) {
    throw new Error(`Multiple records found for updates to ${storageConfig.cssContractApplications.folder}, expected only one`)
  } else if (etlStageLogs.length === 0) {
    return
  }

  await db.sequelize.query(`
    WITH new_data AS (
      SELECT
        cc.contract_id,
        cc.start_dt AS agreementStart,
        cc.end_dt AS agreementEnd,
        ca.application_id,
        cl.change_type,
        MIN(cl.pkid) AS pkid
      FROM etl_stage_css_contract_applications cl
      LEFT JOIN etl_stage_css_contract_applications ca ON cl.contract_id = ca.contract_id AND ca.data_source_s_code = '000001'
      LEFT JOIN etl_stage_css_contracts cc ON cl.contract_id = cc.contract_id AND cc.contract_state_s_code = '000020'
      WHERE cl.data_source_s_code = 'CAPCLM'
        AND cl.etl_id BETWEEN :idFrom AND :idTo
      GROUP BY cc.contract_id, cc.start_dt, cc.end_dt, ca.application_id, cl.change_type
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
      contract_id, agreementStart, agreementEnd, application_id
    )
    SELECT contract_id, agreementStart, agreementEnd, application_id
    FROM new_data
    WHERE change_type = 'INSERT'
      OR (change_type = 'UPDATE' AND pkid NOT IN (SELECT pkid FROM updated_rows));
  `, {
    replacements: {
      idFrom: etlStageLogs[0].id_from,
      idTo: etlStageLogs[0].id_to
    },
    raw: true,
    transaction
  })
}

module.exports = {
  loadIntermApplicationContract
}
