const { storageConfig } = require('../../config')
const db = require('../../data')

const loadIntermApplicationPayment = async (startDate, transaction) => {
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
          CL.application_id,
          APN.invoice_number,
          substring(APN.invoice_number, position('A' in APN.invoice_number) + 2, length(APN.invoice_number) - (position('A' in APN.invoice_number) + 1))::integer AS invoice_id,
          id_clc_header,
          APN.change_type
        FROM etl_stage_apps_payment_notification APN
        INNER JOIN etl_stage_css_contract_applications CA 
          ON APN.application_id = CA.application_id
        INNER JOIN etl_stage_css_contract_applications CL 
          ON CA.contract_id = CL.contract_id
        WHERE CA.data_source_s_code = 'CAPCLM'
          AND CL.data_source_s_code = '000001'
          AND APN.notification_flag = 'P'
          AND APN.etl_id BETWEEN :idFrom AND :idTo
      ),
      updated_rows AS (
        UPDATE etl_interm_application_payment interm
        SET
          invoice_number = new_data.invoice_number,
          invoice_id = new_data.invoice_id,
          etl_inserted_dt = NOW()
        FROM new_data
        WHERE new_data.change_type = 'UPDATE'
          AND interm.application_id = new_data.application_id
          AND interm.id_clc_header = new_data.id_clc_header
        RETURNING interm.application_id, interm.id_clc_header
      )
      INSERT INTO etl_interm_application_payment (
        application_id,
        invoice_number,
        invoice_id,
        id_clc_header
      )
      SELECT
        application_id,
        invoice_number,
        invoice_id,
        id_clc_header
      FROM new_data
      WHERE change_type = 'INSERT'
        OR (change_type = 'UPDATE' AND (application_id, id_clc_header) NOT IN (SELECT application_id, id_clc_header FROM updated_rows));
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
  loadIntermApplicationPayment
}
