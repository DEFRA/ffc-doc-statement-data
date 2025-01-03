const { storageConfig } = require('../../config')
const db = require('../../data')

const loadIntermCalcOrg = async (startDate, transaction) => {
  const etlStageLogs = await db.etlStageLog.findAll({
    where: {
      file: `${storageConfig.appsPaymentNotification.folder}/export.csv`,
      ended_at: {
        [db.Sequelize.Op.gt]: startDate
      }
    }
  })

  if (etlStageLogs.length > 1) {
    throw new Error(`Multiple records found for updates to ${storageConfig.appsPaymentNotification.folder}, expected only one`)
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
          CD.calculation_id,
          BAC.sbi,
          BAC.frn,
          CD.application_id,
          CD.calculation_dt,
          CD.id_clc_header,
          APN.change_type
        FROM etl_stage_apps_payment_notification APN
        INNER JOIN etl_stage_css_contract_applications CLAIM 
          ON CLAIM.application_id = APN.application_id 
          AND CLAIM.data_source_s_code = 'CAPCLM'
        INNER JOIN etl_stage_css_contract_applications APP 
          ON APP.contract_id = CLAIM.contract_id 
          AND APP.data_source_s_code = '000001'
        INNER JOIN etl_interm_finance_dax D 
          ON D.claim_id = CLAIM.application_id
        INNER JOIN etl_stage_finance_dax SD 
          ON SD.invoiceid = D.invoiceid
        INNER JOIN etl_stage_business_address_contact_v BAC 
          ON BAC.frn = SD.custvendac
        INNER JOIN etl_stage_calculation_details CD 
          ON CD.application_id = APN.application_id 
          AND CD.id_clc_header = APN.id_clc_header
          AND CD.ranked = 1
        WHERE APN.notification_flag = 'P'
          AND APN.etl_id BETWEEN :idFrom AND :idTo
        GROUP BY CD.calculation_id, BAC.sbi, BAC.frn, CD.application_id, CD.calculation_dt, CD.id_clc_header, APN.change_type
      ),
      updated_rows AS (
        UPDATE etl_interm_calc_org interm
        SET
          sbi = new_data.sbi,
          frn = new_data.frn,
          calculation_date = new_data.calculation_dt,
          etl_inserted_dt = NOW()
        FROM new_data
        WHERE new_data.change_type = 'UPDATE'
          AND interm.calculation_id = new_data.calculation_id
          AND interm.id_clc_header = new_data.id_clc_header
        RETURNING interm.calculation_id, interm.id_clc_header
      )
      INSERT INTO etl_interm_calc_org (
        calculation_id,
        sbi,
        frn,
        application_id,
        calculation_date,
        id_clc_header
      )
      SELECT
        calculation_id,
        sbi,
        frn,
        application_id,
        calculation_dt,
        id_clc_header
      FROM new_data
      WHERE change_type = 'INSERT'
        OR (change_type = 'UPDATE' AND (calculation_id, id_clc_header) NOT IN (SELECT calculation_id, id_clc_header FROM updated_rows));
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
  loadIntermCalcOrg
}
