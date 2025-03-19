const { storageConfig } = require('../../config')
const { getEtlStageLogs, executeQuery } = require('./load-interm-utils')

const loadIntermApplicationPayment = async (startDate, transaction) => {
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
    WITH "newData" AS (
      SELECT
        CL.""applicationId"",
        APN.""invoiceNumber"",
        substring(APN.""invoiceNumber"", position('A' in APN.""invoiceNumber"") + 2, length(APN.""invoiceNumber"") - (position('A' in APN.""invoiceNumber"") + 1))::integer AS ""invoiceId"",
        "idClcHeader",
        ${tableAlias}."changeType"
      FROM "etlStageAppsPaymentNotification" APN
      INNER JOIN "etlStageCssContractApplications" CA 
        ON APN.""applicationId"" = CA.""applicationId""
      INNER JOIN "etlStageCssContractApplications" CL 
        ON CA."contractId" = CL."contractId"
      WHERE CA."dataSourceSCode" = 'CAPCLM'
        AND CL."dataSourceSCode" = '000001'
        AND APN."notificationFlag" = 'P'
        AND ${tableAlias}."etlId" BETWEEN ${idFrom} AND ${idTo}
        ${exclusionCondition}
    ),
    "updatedRows" AS (
      UPDATE "etlIntermApplicationPayment" interm
      SET
        "invoiceNumber" = "newData"."invoiceNumber",
        "invoiceId" = "newData"."invoiceId",
        "etlInsertedDt" = NOW()
      FROM "newData"
      WHERE "newData"."changeType" = 'UPDATE'
        AND interm."applicationId" = "newData"."applicationId"
        AND interm."idClcHeader" = "newData"."idClcHeader"
      RETURNING interm."applicationId", interm."idClcHeader"
    )
    INSERT INTO "etlIntermApplicationPayment" (
      "applicationId",
      "invoiceNumber",
      "invoiceId",
      "idClcHeader"
    )
    SELECT
      "applicationId",
      "invoiceNumber",
      "invoiceId",
      "idClcHeader"
    FROM "newData"
      WHERE "changeType" = 'INSERT'
        OR ("changeType" = 'UPDATE' AND ("applicationId", "idClcHeader") NOT IN (SELECT "applicationId", "idClcHeader" FROM "updatedRows"));
  `

  const batchSize = storageConfig.etlBatchSize
  let exclusionScript = ''
  for (const log of etlStageLogs) {
    const folderMatch = log.file.match(/^(.*)\/export\.csv$/)
    const folder = folderMatch ? folderMatch[1] : ''
    const tableAlias = folderToAliasMap[folder]

    for (let i = log.idFrom; i <= log.idTo; i += batchSize) {
      console.log(`Processing application payment records for ${folder} ${i} to ${Math.min(i + batchSize - 1, log.idTo)}`)
      const query = queryTemplate(i, Math.min(i + batchSize - 1, log.idTo), tableAlias, exclusionScript)
      await executeQuery(query, {}, transaction)
    }

    console.log(`Processed application payment records for ${folder}`)
    exclusionScript += ` AND ${tableAlias}.etlId NOT BETWEEN ${log.idFrom} AND ${log.idTo}`
  }
}

module.exports = {
  loadIntermApplicationPayment
}
