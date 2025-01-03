const { storageConfig } = require('../../config')
const db = require('../../data')

const loadIntermApplicationClaim = async (startDate, transaction) => {
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

  const batchSize = storageConfig.etlBatchSize
  const idFrom = etlStageLogs[0].id_from
  const idTo = etlStageLogs[0].id_to
  for (let i = idFrom; i <= idTo; i += batchSize) {
    await db.sequelize.query(`
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
    `, {
      replacements: {
        idFrom: i,
        idTo: Math.min(i + batchSize - 1, idTo)
      },
      raw: true,
      transaction
    })
  }
}

module.exports = {
  loadIntermApplicationClaim
}
