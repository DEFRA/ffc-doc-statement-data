const { storageConfig } = require('../../config')
const { getEtlStageLogs, executeQuery } = require('./load-interm-utils')

const loadIntermAppCalcResultsDelinkPayment = async (startDate, transaction) => {
  const tablesToCheck = [
    storageConfig.appCalculationResultsDelinkPayments.folder
  ]

  const folderToAliasMap = {
    [storageConfig.appCalculationResultsDelinkPayments.folder]: 'DP',
    [storageConfig.calculationsDetailsDelinked.folder]: 'CD',
    [storageConfig.businessAddressDelinked.folder]: 'BAC',
    [storageConfig.applicationDetailDelinked.folder]: 'AD',
    [storageConfig.defraLinksDelinked.folder]: 'DL',
    [storageConfig.organisationDelinked.folder]: 'O'
  }

  const etlStageLogs = await getEtlStageLogs(startDate, tablesToCheck)

  if (!etlStageLogs.length) {
    return
  }

  const fields = [
    '"calculation_id"',
    '"application_id"',
    '"paymentBand1"',
    '"paymentBand2"',
    '"paymentBand3"',
    '"paymentBand4"',
    '"percentageReduction1"',
    '"percentageReduction2"',
    '"percentageReduction3"',
    '"percentageReduction4"',
    '"progressiveReductions1"',
    '"progressiveReductions2"',
    '"progressiveReductions3"',
    '"progressiveReductions4"',
    '"referenceAmount"',
    '"totalProgressiveReduction"',
    '"totalDelinkedPayment"',
    '"paymentAmountCalculated"',
    '"sbi"',
    '"frn"'
  ]

  const fieldsString = fields.join(', ')

  const queryTemplate = (idFrom, idTo, tableAlias, exclusionCondition) => `
    WITH new_data AS (
      SELECT
        DP.calculation_id,
        CD.application_id,
        MAX(CASE WHEN DP.variable_name = 'PI_BPS_BAND1' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "paymentBand1",
        MAX(CASE WHEN DP.variable_name = 'PI_BPS_BAND2' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "paymentBand2",
        MAX(CASE WHEN DP.variable_name = 'PI_BPS_BAND3' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "paymentBand3",
        MAX(CASE WHEN DP.variable_name = 'PI_BPS_BAND4' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "paymentBand4",
        MAX(CASE WHEN DP.variable_name = 'PI_BPS_BANDPRC1' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "percentageReduction1",
        MAX(CASE WHEN DP.variable_name = 'PI_BPS_BANDPRC2' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "percentageReduction2",
        MAX(CASE WHEN DP.variable_name = 'PI_BPS_BANDPRC3' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "percentageReduction3",
        MAX(CASE WHEN DP.variable_name = 'PI_BPS_BANDPRC4' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "percentageReduction4",
        MAX(CASE WHEN DP.variable_name = 'PROG_RED_BAND_1' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "progressiveReductions1",
        MAX(CASE WHEN DP.variable_name = 'PROG_RED_BAND_2' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "progressiveReductions2",
        MAX(CASE WHEN DP.variable_name = 'PROG_RED_BAND_3' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "progressiveReductions3",
        MAX(CASE WHEN DP.variable_name = 'PROG_RED_BAND_4' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "progressiveReductions4",
        MAX(CASE WHEN DP.variable_name = 'CUR_REF_AMOUNT' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "referenceAmount",
        MAX(CASE WHEN DP.variable_name = 'TOT_PRO_RED_AMO' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "totalProgressiveReduction",
        MAX(CASE WHEN DP.variable_name = 'NE_TOT_AMOUNT' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "totalDelinkedPayment",
        T.total_amount AS "paymentAmountCalculated",
        O.sbi,
        CAST(BAC.frn AS INTEGER) AS frn,
        ${tableAlias}.change_type
      FROM etl_stage_app_calc_results_delink_payments DP
      JOIN etl_stage_calculation_details CD ON DP.calculation_id = CD.calculation_id
      JOIN etl_stage_application_detail AD ON AD.application_id = CD.application_id
      JOIN etl_stage_defra_links DL ON DL.subject_id = AD.subject_id
      JOIN etl_stage_organisation O ON O.party_id = DL.defra_id
      JOIN etl_stage_business_address_contact_v BAC ON BAC.sbi = O.sbi
      JOIN etl_interm_total T ON T.calculation_id = DP.calculation_id
      WHERE ${tableAlias}.etl_id BETWEEN ${idFrom} AND ${idTo}
        ${exclusionCondition}
      GROUP BY DP.calculation_id, CD.application_id, O.sbi, BAC.frn, ${tableAlias}.change_type, T.total_amount
    ),
    updated_rows AS (
      UPDATE etl_interm_app_calc_results_delink_payments interm
      SET
        calculation_id = new_data.calculation_id,
        application_id = new_data.application_id,
        "paymentBand1" = new_data."paymentBand1",
        "paymentBand2" = new_data."paymentBand2",
        "paymentBand3" = new_data."paymentBand3",
        "paymentBand4" = new_data."paymentBand4",
        "percentageReduction1" = new_data."percentageReduction1",
        "percentageReduction2" = new_data."percentageReduction2",
        "percentageReduction3" = new_data."percentageReduction3",
        "percentageReduction4" = new_data."percentageReduction4",
        "progressiveReductions1" = new_data."progressiveReductions1",
        "progressiveReductions2" = new_data."progressiveReductions2",
        "progressiveReductions3" = new_data."progressiveReductions3",
        "progressiveReductions4" = new_data."progressiveReductions4",
        "referenceAmount" = new_data."referenceAmount",
        "totalProgressiveReduction" = new_data."totalProgressiveReduction",
        "totalDelinkedPayment" = new_data."totalDelinkedPayment",
        "paymentAmountCalculated" = new_data."paymentAmountCalculated",
        sbi = new_data.sbi,
        frn = new_data.frn,
        etl_inserted_dt = NOW()
      FROM new_data
      WHERE new_data.change_type = 'UPDATE'
        AND interm.calculation_id = new_data.calculation_id
        AND interm.application_id = new_data.application_id
      RETURNING interm.calculation_id, interm.application_id
    )
    INSERT INTO etl_interm_app_calc_results_delink_payments (
      ${fieldsString}
    )
    SELECT ${fieldsString}
    FROM new_data
    WHERE change_type = 'INSERT'
        OR (change_type = 'UPDATE' AND (calculation_id, application_id) NOT IN (SELECT calculation_id, application_id FROM updated_rows));
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
      console.log(`Processing app calculation results delink payments records for ${folder} ${i} to ${Math.min(i + batchSize - 1, log.id_to)}`)
      const query = queryTemplate(i, Math.min(i + batchSize - 1, log.id_to), tableAlias, exclusionCondition)

      console.log(query)
      await executeQuery(query, {}, transaction)
    }
  }
}

module.exports = {
  loadIntermAppCalcResultsDelinkPayment
}
