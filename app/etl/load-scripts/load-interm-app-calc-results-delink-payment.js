const { etlConfig } = require('../../config')
const { getEtlStageLogs, processWithWorkers } = require('./load-interm-utils')
const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

const tablesToCheck = [
  etlConfig.appCalculationResultsDelinkPayments.folder
]

const folderToAliasMap = {
  [etlConfig.appCalculationResultsDelinkPayments.folder]: 'DP',
  [etlConfig.calculationsDetailsDelinked.folder]: 'CD',
  [etlConfig.businessAddressDelinked.folder]: 'BAC',
  [etlConfig.applicationDetailDelinked.folder]: 'AD',
  [etlConfig.defraLinksDelinked.folder]: 'DL',
  [etlConfig.organisationDelinked.folder]: 'O'
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
].join(', ')

const queryTemplate = (idFrom, idTo, tableAlias, exclusionCondition) => `
  WITH "newData" AS (
    SELECT
      DP."calculationId",
      CD."applicationId",
      MAX(CASE WHEN DP."variableName" = 'PI_BPS_BAND1' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "paymentBand1",
      MAX(CASE WHEN DP."variableName" = 'PI_BPS_BAND2' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "paymentBand2",
      MAX(CASE WHEN DP."variableName" = 'PI_BPS_BAND3' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "paymentBand3",
      MAX(CASE WHEN DP."variableName" = 'PI_BPS_BAND4' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "paymentBand4",
      MAX(CASE WHEN DP."variableName" = 'PI_BPS_BANDPRC1' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "percentageReduction1",
      MAX(CASE WHEN DP."variableName" = 'PI_BPS_BANDPRC2' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "percentageReduction2",
      MAX(CASE WHEN DP."variableName" = 'PI_BPS_BANDPRC3' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "percentageReduction3",
      MAX(CASE WHEN DP."variableName" = 'PI_BPS_BANDPRC4' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "percentageReduction4",
      MAX(CASE WHEN DP."variableName" = 'PROG_RED_BAND_1' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "progressiveReductions1",
      MAX(CASE WHEN DP."variableName" = 'PROG_RED_BAND_2' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "progressiveReductions2",
      MAX(CASE WHEN DP."variableName" = 'PROG_RED_BAND_3' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "progressiveReductions3",
      MAX(CASE WHEN DP."variableName" = 'PROG_RED_BAND_4' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "progressiveReductions4",
      MAX(CASE WHEN DP."variableName" = 'CUR_REF_AMOUNT' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "referenceAmount",
      MAX(CASE WHEN DP."variableName" = 'TOT_PRO_RED_AMO' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "totalProgressiveReduction",
      MAX(CASE WHEN DP."variableName" = 'NE_TOT_AMOUNT' THEN CAST(DP.value AS NUMERIC) ELSE 0 END) AS "totalDelinkedPayment",
      MAX(CASE WHEN DP."variableName" = 'NE_TOT_AMOUNT' THEN CAST(DP.value AS NUMERIC) / 2 ELSE 0 END) AS "paymentAmountCalculated",
      O.sbi,
      CAST(BAC.frn AS INTEGER) AS frn,
      ${tableAlias}."changeType"
    FROM ${dbConfig.schema}."etlStageAppCalcResultsDelinkPayments" DP
    JOIN ${dbConfig.schema}."etlStageCalculationDetails" CD ON DP."calculationId" = CD."calculationId"
    JOIN ${dbConfig.schema}."etlStageApplicationDetail" AD ON AD."applicationId" = CD."applicationId"
    JOIN ${dbConfig.schema}."etlStageDefraLinks" DL ON DL."subjectId" = AD."subjectId"
    JOIN ${dbConfig.schema}."etlStageOrganisation" O ON O."partyId" = DL."defraId"
    JOIN ${dbConfig.schema}."etlStageBusinessAddressContactV" BAC ON BAC.sbi = O.sbi
    WHERE ${tableAlias}."etlId" BETWEEN ${idFrom} AND ${idTo}
      ${exclusionCondition}
    GROUP BY DP."calculationId", CD."applicationId", O.sbi, BAC.frn, ${tableAlias}."changeType"
  ),
  "updatedRows" AS (
    UPDATE ${dbConfig.schema}."etlIntermAppCalcResultsDelinkPayments" interm
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
      "etlInsertedDt" = NOW()
    FROM "newData"
    WHERE "newData"."changeType" = 'UPDATE'
      AND interm."calculationId" = "newData"."calculationId"
      AND interm."applicationId" = "newData"."applicationId"
    RETURNING interm."calculationId", interm."applicationId"
  )
  INSERT INTO ${dbConfig.schema}."etlIntermAppCalcResultsDelinkPayments" (
    ${fields}
  )
  SELECT ${fields}
  FROM "newData"
  WHERE "changeType" = 'INSERT'
      OR ("changeType" = 'UPDATE' AND ("calculationId", "applicationId") NOT IN (SELECT "calculationId", "applicationId" FROM "updatedRows"));
`

const loadIntermAppCalcResultsDelinkPayment = async (startDate, transaction) => {
  const etlStageLogs = await getEtlStageLogs(startDate, tablesToCheck)

  if (!etlStageLogs.length) {
    return
  }

  const batchSize = etlConfig.etlBatchSize
  let exclusionScript = ''
  for (const log of etlStageLogs) {
    const folderMatch = log.file.match(/^(.*)\/export\.csv$/)
    const folder = folderMatch ? folderMatch[1] : ''
    const tableAlias = folderToAliasMap[folder]

    await processWithWorkers({ query: null, batchSize, idFrom: log.idFrom, idTo: log.idTo, transaction, recordType: `app calc results delinked payment records records for folder ${folder}`, queryTemplate, exclusionScript, tableAlias })

    console.log(`Processed app calc results delinked payment records for ${folder}`)
    exclusionScript += ` AND ${tableAlias}.etlId NOT BETWEEN ${log.idFrom} AND ${log.idTo}`
  }
}

module.exports = {
  loadIntermAppCalcResultsDelinkPayment
}
