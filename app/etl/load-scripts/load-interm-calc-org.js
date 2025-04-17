const config = require('../../config')
const etlConfig = config.etlConfig
const dbConfig = config.dbConfig[config.env]
const { getEtlStageLogs, processWithWorkers } = require('./load-interm-utils')

const defaultTablesToCheck = [
  etlConfig.appsPaymentNotification.folder,
  etlConfig.cssContractApplications.folder,
  etlConfig.financeDAX.folder,
  etlConfig.businessAddress.folder,
  etlConfig.calculationsDetails.folder
]

const defaultFolderToAliasMap = {
  [etlConfig.appsPaymentNotification.folder]: 'APN',
  [etlConfig.cssContractApplications.folder]: 'APP',
  [etlConfig.financeDAX.folder]: 'SD',
  [etlConfig.businessAddress.folder]: 'BAC',
  [etlConfig.calculationsDetails.folder]: 'CD'
}

const loadIntermCalcOrg = async (startDate, transaction, tablesToCheck = defaultTablesToCheck, folderToAliasMap = defaultFolderToAliasMap) => {
  const etlStageLogs = await getEtlStageLogs(startDate, tablesToCheck)

  if (!etlStageLogs.length) {
    return
  }

  const queryTemplate = (idFrom, idTo, tableAlias, exclusionCondition) => `
    WITH "newData" AS (
      SELECT
        CD."calculationId",
        BAC.sbi,
        BAC.frn,
        CD."applicationId",
        CD."calculationDt",
        CD."idClcHeader",
        ${tableAlias}."changeType"
      FROM ${dbConfig.schema}."etlStageAppsPaymentNotification" APN
      INNER JOIN ${dbConfig.schema}."etlStageCssContractApplications" CLAIM 
        ON CLAIM."applicationId" = APN."applicationId" 
        AND CLAIM."dataSourceSCode" = 'CAPCLM'
      INNER JOIN ${dbConfig.schema}."etlStageCssContractApplications" APP 
        ON APP."contractId" = CLAIM."contractId" 
        AND APP."dataSourceSCode" = '000001'
      INNER JOIN ${dbConfig.schema}."etlIntermFinanceDax" D 
        ON D."claimId" = CLAIM."applicationId"
      INNER JOIN ${dbConfig.schema}."etlStageFinanceDax" SD 
        ON SD.invoiceid = D.invoiceid
      INNER JOIN ${dbConfig.schema}."etlStageBusinessAddressContactV" BAC 
        ON BAC.frn = SD.custvendac
      INNER JOIN ${dbConfig.schema}."etlStageCalculationDetails" CD 
        ON CD."applicationId" = APN."applicationId" 
        AND CD."idClcHeader" = APN."idClcHeader"
        AND CD.ranked = 1
      WHERE APN."notificationFlag" = 'P'
        AND ${tableAlias}."etlId" BETWEEN ${idFrom} AND ${idTo}
        ${exclusionCondition}
      GROUP BY CD."calculationId", BAC.sbi, BAC.frn, CD."applicationId", CD."calculationDt", CD."idClcHeader", ${tableAlias}."changeType"
    ),
    updatedrows AS (
      UPDATE ${dbConfig.schema}."etlIntermCalcOrg" interm
      SET
        sbi = "newData".sbi,
        frn = "newData".frn,
        "calculationDate" = "newData"."calculationDt",
        "etlInsertedDt" = NOW()
      FROM "newData"
      WHERE "newData"."changeType" = 'UPDATE'
        AND interm."calculationId" = "newData"."calculationId"
        AND interm."idClcHeader" = "newData"."idClcHeader"
      RETURNING interm."calculationId", interm."idClcHeader"
    )
    INSERT INTO ${dbConfig.schema}."etlIntermCalcOrg" (
      "calculationId",
      sbi,
      frn,
      "applicationId",
      "calculationDate",
      "idClcHeader"
    )
    SELECT
      "calculationId",
      sbi,
      frn,
      "applicationId",
      "calculationDt",
      "idClcHeader"
    FROM "newData"
    WHERE "changeType" = 'INSERT'
      OR ("changeType" = 'UPDATE' AND ("calculationId", "idClcHeader") NOT IN (SELECT "calculationId", "idClcHeader" FROM updatedrows));
  `

  const batchSize = etlConfig.etlBatchSize
  let exclusionScript = ''
  for (const log of etlStageLogs) {
    const folderMatch = log.file.match(/^(.*)\/export\.csv$/)
    const folder = folderMatch ? folderMatch[1] : ''
    const tableAlias = folderToAliasMap[folder]

    await processWithWorkers(null, batchSize, log.idFrom, log.idTo, transaction, 'calcOrg', queryTemplate, exclusionScript, tableAlias)

    console.log(`Processed calcOrg records for ${folder}`)
    exclusionScript += ` AND ${tableAlias}."etlId" NOT BETWEEN ${log.idFrom} AND ${log.idTo}`
  }
}

const loadIntermCalcOrgDelinked = async (startDate, transaction) => {
  const tablesToCheck = [
    etlConfig.appsPaymentNotificationDelinked.folder,
    etlConfig.cssContractApplicationsDelinked.folder,
    etlConfig.financeDAXDelinked.folder,
    etlConfig.businessAddressDelinked.folder,
    etlConfig.calculationsDetailsDelinked.folder
  ]

  const folderToAliasMap = {
    [etlConfig.appsPaymentNotificationDelinked.folder]: 'APN',
    [etlConfig.cssContractApplicationsDelinked.folder]: 'APP',
    [etlConfig.financeDAXDelinked.folder]: 'SD',
    [etlConfig.businessAddressDelinked.folder]: 'BAC',
    [etlConfig.calculationsDetailsDelinked.folder]: 'CD'
  }

  return loadIntermCalcOrg(startDate, transaction, tablesToCheck, folderToAliasMap)
}

module.exports = {
  loadIntermCalcOrg,
  loadIntermCalcOrgDelinked
}
