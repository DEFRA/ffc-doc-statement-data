const { storageConfig } = require('../../config')
const { getEtlStageLogs, executeQuery } = require('./load-interm-utils')

const loadIntermApplicationPayment = async (startDate) => {
  const tablesToCheck = [
    storageConfig.appsPaymentNotification.folder,
    storageConfig.cssContractApplications.folder
  ]

  const folderToAliasMap = {
    [storageConfig.appsPaymentNotification.folder]: 'APN',
    [storageConfig.cssContractApplications.folder]: 'CA'
  }

  const etlStageLogs = await getEtlStageLogs(startDate, tablesToCheck)

  if (!etlStageLogs.length) {
    return
  }

  const queryTemplate = (idFrom, idTo, tableAlias, exclusionCondition) => `
    WITH new_data AS (
      SELECT
        CL.application_id,
        APN.invoice_number,
        substring(APN.invoice_number, position('A' in APN.invoice_number) + 2, length(APN.invoice_number) - (position('A' in APN.invoice_number) + 1))::integer AS invoice_id,
        id_clc_header,
        ${tableAlias}.change_type
      FROM etl_stage_apps_payment_notification APN
      INNER JOIN etl_stage_css_contract_applications CA 
        ON APN.application_id = CA.application_id
      INNER JOIN etl_stage_css_contract_applications CL 
        ON CA.contract_id = CL.contract_id
      WHERE CA.data_source_s_code = 'CAPCLM'
        AND CL.data_source_s_code = '000001'
        AND APN.notification_flag = 'P'
        AND ${tableAlias}.etl_id BETWEEN ${idFrom} AND ${idTo}
        ${exclusionCondition}
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
  `

  const batchSize = storageConfig.etlBatchSize
  let exclusionCondition = ''
  for (const log of etlStageLogs) {
    const folderMatch = log.file.match(/^(.*)\/export\.csv$/)
    const folder = folderMatch ? folderMatch[1] : ''
    const tableAlias = folderToAliasMap[folder]

    for (let i = log.id_from; i <= log.id_to; i += batchSize) {
      console.log(`Processing application payment records for ${folder} ${i} to ${Math.min(i + batchSize - 1, log.id_to)}`)
      const query = queryTemplate(i, Math.min(i + batchSize - 1, log.id_to), tableAlias, exclusionCondition)
      await executeQuery(query, {})
    }

    console.log(`Processed application payment records for ${folder}`)
    exclusionCondition += ` AND ${tableAlias}.etl_id NOT BETWEEN ${log.id_from} AND ${log.id_to}`
  }
}

module.exports = {
  loadIntermApplicationPayment
}
