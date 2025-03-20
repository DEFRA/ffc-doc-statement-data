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
    '"calculationId"',
    '"applicationId"',
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

  // todo change all the app calc column casing

  const fieldsString = fields.join(', ')
  const queryTemplate = (idFrom, idTo, tableAlias, exclusionCondition) => `
    WITH "newData" AS (
      SELECT
        DP."calculationId",
        CD."applicationId",
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
        MAX(CASE WHEN DP.variable_name = 'NE_TOT_AMOUNT' THEN CAST(DP.value AS NUMERIC) / 2 ELSE 0 END) AS "paymentAmountCalculated",
        O.sbi,
        CAST(BAC.frn AS INTEGER) AS frn,
        ${tableAlias}."changeType"
      FROM etl_stage_app_calc_results_delink_payments DP
      JOIN "etlStageCalculationDetails" CD ON DP."calculationId" = CD."calculationId"
      JOIN "etlStageApplicationDetail" AD ON AD."applicationId" = CD."applicationId"
      JOIN "etlStageDefraLinks" DL ON DL.subject_id = AD.subject_id
      JOIN "etlStageOrganisation" O ON O.party_id = DL.defra_id
      JOIN "etlStageBusinessAddressContactV" BAC ON BAC.sbi = O.sbi
      WHERE ${tableAlias}."etlId" BETWEEN ${idFrom} AND ${idTo}
        ${exclusionCondition}
      GROUP BY DP."calculationId", CD."applicationId", O.sbi, BAC.frn, ${tableAlias}."changeType"
    ),
    "updatedRows" AS (
      UPDATE etl_interm_app_calc_results_delink_payments interm
      SET
        "calculationId" = "newData"."calculationId",
        "applicationId" = "newData"."applicationId",
        "paymentBand1" = "newData"."paymentBand1",
        "paymentBand2" = "newData"."paymentBand2",
        "paymentBand3" = "newData"."paymentBand3",
        "paymentBand4" = "newData"."paymentBand4",
        "percentageReduction1" = "newData"."percentageReduction1",
        "percentageReduction2" = "newData"."percentageReduction2",
        "percentageReduction3" = "newData"."percentageReduction3",
        "percentageReduction4" = "newData"."percentageReduction4",
        "progressiveReductions1" = "newData"."progressiveReductions1",
        "progressiveReductions2" = "newData"."progressiveReductions2",
        "progressiveReductions3" = "newData"."progressiveReductions3",
        "progressiveReductions4" = "newData"."progressiveReductions4",
        "referenceAmount" = "newData"."referenceAmount",
        "totalProgressiveReduction" = "newData"."totalProgressiveReduction",
        "totalDelinkedPayment" = "newData"."totalDelinkedPayment",
        "paymentAmountCalculated" = "newData"."paymentAmountCalculated",
        sbi = "newData".sbi,
        frn = "newData".frn,
        etl_inserted_dt = NOW()
      FROM "newData"
      WHERE "newData"."changeType" = 'UPDATE'
        AND interm."calculationId" = "newData"."calculationId"
        AND interm."applicationId" = "newData"."applicationId"
      RETURNING interm."calculationId", interm."applicationId"
    )
    INSERT INTO etl_interm_app_calc_results_delink_payments (
      ${fieldsString}
    )
    SELECT ${fieldsString}
    FROM "newData"
    WHERE "changeType" = 'INSERT'
        OR ("changeType" = 'UPDATE' AND ("calculationId", "applicationId") NOT IN (SELECT "calculationId", "applicationId" FROM "updatedRows"));
  `

  const batchSize = storageConfig.etlBatchSize
  let exclusionScript = ''
  for (const log of etlStageLogs) {
    const folderMatch = log.file.match(/^(.*)\/export\.csv$/)
    const folder = folderMatch ? folderMatch[1] : ''
    const tableAlias = folderToAliasMap[folder]

    for (let i = log.idFrom; i <= log.idTo; i += batchSize) {
      console.log(`Processing app calc results delinked payment records for ${folder} ${i} to ${Math.min(i + batchSize - 1, log.idTo)}`)
      const query = queryTemplate(i, Math.min(i + batchSize - 1, log.idTo), tableAlias, exclusionScript)
      await executeQuery(query, {}, transaction)
    }

    console.log(`Processed app calc results delinked payment records for ${folder}`)
    exclusionScript += ` AND ${tableAlias}.etlId NOT BETWEEN ${log.idFrom} AND ${log.idTo}`
  }
}

module.exports = {
  loadIntermAppCalcResultsDelinkPayment
}
