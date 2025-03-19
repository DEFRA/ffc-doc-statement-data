const { storageConfig } = require('../../config')
const { getEtlStageLogs, executeQuery } = require('./load-interm-utils')

const defaultTablesToCheck = [
  storageConfig.appsPaymentNotification.folder,
  storageConfig.cssContractApplications.folder,
  storageConfig.financeDAX.folder,
  storageConfig.businessAddress.folder,
  storageConfig.calculationsDetails.folder
]

const defaultFolderToAliasMap = {
  [storageConfig.appsPaymentNotification.folder]: 'APN',
  [storageConfig.cssContractApplications.folder]: 'APP',
  [storageConfig.financeDAX.folder]: 'SD',
  [storageConfig.businessAddress.folder]: 'BAC',
  [storageConfig.calculationsDetails.folder]: 'CD'
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
        BAC."sbi",
        BAC."frn",
        CD."applicationId",
        CD."calculationDt",
        CD."idClcHeader",
        ${tableAlias}."changeType"
      FROM "etlStageAppsPaymentNotification" APN
      INNER JOIN "etlStageCssContractApplications" CLAIM 
        ON CLAIM."applicationId" = APN."applicationId" 
        AND CLAIM."dataSourceSCode" = 'CAPCLM'
      INNER JOIN "etlStageCssContractApplications" APP 
        ON APP."contractId" = CLAIM."contractId" 
        AND APP."dataSourceSCode" = '000001'
      INNER JOIN "etlIntermFinanceDax" D 
        ON D."claimId" = CLAIM."applicationId"
      INNER JOIN "etlStageFinanceDax" SD 
        ON SD."invoiceid" = D."invoiceid"
      INNER JOIN "etlStageBusinessAddressContactV" BAC 
        ON BAC."frn" = SD."custvendac"
      INNER JOIN "etlStageCalculationDetails" CD 
        ON CD."applicationId" = APN."applicationId" 
        AND CD."idClcHeader" = APN."idClcHeader"
        AND CD."ranked" = 1
      WHERE APN."notificationFlag" = 'P'
        AND ${tableAlias}."etlId" BETWEEN ${idFrom} AND ${idTo}
        ${exclusionCondition}
      GROUP BY CD."calculationId", BAC."sbi", BAC."frn", CD."applicationId", CD."calculationDt", CD."idClcHeader", ${tableAlias}."changeType"
    ),
    "updatedRows" AS (
      UPDATE "etlIntermCalcOrg" interm
      SET
        "sbi" = "newData"."sbi",
        "frn" = "newData"."frn",
        "calculationDate" = "newData"."calculationDt",
        "etlInsertedDt" = NOW()
      FROM "newData"
      WHERE "newData"."changeType" = 'UPDATE'
        AND interm."calculationId" = "newData"."calculationId"
        AND interm."idClcHeader" = "newData"."idClcHeader"
      RETURNING interm."calculationId", interm."idClcHeader"
    )
    INSERT INTO "etlIntermCalcOrg" (
      "calculationId",
      "sbi",
      "frn",
      "applicationId",
      "calculationDate",
      "idClcHeader"
    )
    SELECT
      "calculationId",
      "sbi",
      "frn",
      "applicationId",
      "calculationDt",
      "idClcHeader"
    FROM "newData"
    WHERE "changeType" = 'INSERT'
      OR ("changeType" = 'UPDATE' AND ("calculationId", "idClcHeader") NOT IN (SELECT "calculationId", "idClcHeader" FROM "updatedRows"));
  `

  const batchSize = storageConfig.etlBatchSize
  const exclusionScript = ''
  for (const log of etlStageLogs) {
    const folderMatch = log.file.match(/^(.*)\/export\.csv$/)
    const folder = folderMatch ? folderMatch[1] : ''
    const tableAlias = folderToAliasMap[folder]

    for (let i = log.idFrom; i <= log.idTo; i += batchSize) {
      console.log(`Processing calcOrg records for ${folder} ${i} - ${Math.min(i + batchSize - 1, log.idTo)}`)
      const query = queryTemplate(i, Math.min(i + batchSize - 1, log.idTo), tableAlias, exclusionScript)
      await executeQuery(query, {}, transaction)
    }
  }
}

const loadIntermCalcOrgDelinked = async (startDate, transaction) => {
  const tablesToCheck = [
    storageConfig.appsPaymentNotificationDelinked.folder,
    storageConfig.cssContractApplicationsDelinked.folder,
    storageConfig.financeDAXDelinked.folder,
    storageConfig.businessAddressDelinked.folder,
    storageConfig.calculationsDetailsDelinked.folder
  ]

  const folderToAliasMap = {
    [storageConfig.appsPaymentNotificationDelinked.folder]: 'APN',
    [storageConfig.cssContractApplicationsDelinked.folder]: 'APP',
    [storageConfig.financeDAXDelinked.folder]: 'SD',
    [storageConfig.businessAddressDelinked.folder]: 'BAC',
    [storageConfig.calculationsDetailsDelinked.folder]: 'CD'
  }

  return loadIntermCalcOrg(startDate, transaction, tablesToCheck, folderToAliasMap)
}

module.exports = {
  loadIntermCalcOrg,
  loadIntermCalcOrgDelinked
}
