const { storageConfig } = require('../../config')
const { getEtlStageLogs, executeQuery } = require('./load-interm-utils')

const loadIntermApplicationClaim = async (startDate, transaction) => {
  const tablesToCheck = [
    storageConfig.cssContractApplications.folder,
    storageConfig.cssContract.folder
  ]

  const folderToAliasMap = {
    [storageConfig.cssContractApplications.folder]: 'cl',
    [storageConfig.cssContract.folder]: 'cc'
  }

  const etlStageLogs = await getEtlStageLogs(startDate, tablesToCheck)

  if (!etlStageLogs.length) {
    return
  }

  const queryTemplate = (idFrom, idTo, tableAlias, exclusionCondition) => `
    WITH new_data AS (
      SELECT
        cc.contract_id,
        ca.application_id AS claim_id,
        ca.application_id AS agreement_id,
        cl.pkid,
        ${tableAlias}.change_type
      FROM etl_stage_css_contract_applications cl
      LEFT JOIN etl_stage_css_contract_applications ca ON cl.contract_id = ca.contract_id AND ca.data_source_s_code = '000001'
      LEFT JOIN etl_stage_css_contracts cc ON cl.contract_id = cc.contract_id
      WHERE cl.data_source_s_code = 'CAPCLM'
        AND ${tableAlias}.etl_id BETWEEN ${idFrom} AND ${idTo}
        ${exclusionCondition}
      GROUP BY cc.contract_id, cc.start_dt, cc.end_dt, ca.application_id, ${tableAlias}.change_type, cl.pkid
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
  const batchSize = storageConfig.etlBatchSize

  for (const log of etlStageLogs) {
    const folderMatch = log.file.match(/^(.*)\/export\.csv$/)
    const folder = folderMatch ? folderMatch[1] : ''
    const tableAlias = folderToAliasMap[folder]

    const folderIndex = tablesToCheck.indexOf(folder)
    let exclusionCondition = ''
    for (let i = 0; i < folderIndex; i++) {
      const priorFolder = tablesToCheck[i]
      exclusionCondition += ` AND ${folderToAliasMap[priorFolder]}.etl_id NOT BETWEEN ${log.id_from} AND ${log.id_to}`
    }
    for (let i = log.id_from; i <= log.id_to; i += batchSize) {
      console.log(`Processing application claim records for ${folder} ${i} to ${Math.min(i + batchSize - 1, log.id_to)}`)
      const query = queryTemplate(i, Math.min(i + batchSize - 1, log.id_to), tableAlias, exclusionCondition)
      await executeQuery(query, {}, transaction)
    }
  }
}

module.exports = {
  loadIntermApplicationClaim
}
