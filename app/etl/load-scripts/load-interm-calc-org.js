const config = require('../../config')
const etlConfig = config.etlConfig
const dbConfig = config.dbConfig[config.env]
const { getEtlStageLogs, executeQuery } = require('./load-interm-utils')

const tablesToCheck = [
  etlConfig.appsPaymentNotification.folder,
  etlConfig.cssContractApplications.folder,
  etlConfig.financeDAX.folder,
  etlConfig.businessAddress.folder,
  etlConfig.calculationsDetails.folder
]

const folderToAliasMap = {
  [etlConfig.appsPaymentNotification.folder]: 'APN',
  [etlConfig.cssContractApplications.folder]: 'APP',
  [etlConfig.financeDAX.folder]: 'SD',
  [etlConfig.businessAddress.folder]: 'BAC',
  [etlConfig.calculationsDetails.folder]: 'CD'
}

const queryTemplate = (idFrom, idTo, tableAlias, exclusionCondition) => `
    WITH newdata AS (
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
        sbi = newdata.sbi,
        frn = newdata.frn,
        "calculationDate" = newdata."calculationDt",
        "etlInsertedDt" = NOW()
      FROM newdata
      WHERE newdata."changeType" = 'UPDATE'
        AND interm."calculationId" = newdata."calculationId"
        AND interm."idClcHeader" = newdata."idClcHeader"
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
    FROM newdata
    WHERE "changeType" = 'INSERT'
      OR ("changeType" = 'UPDATE' AND ("calculationId", "idClcHeader") NOT IN (SELECT "calculationId", "idClcHeader" FROM updatedrows));
  `
const loadIntermCalcOrg = async (startDate, transaction) => {
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

    for (let i = log.idFrom; i <= log.idTo; i += batchSize) {
      console.log(`Processing calcOrg records for ${folder} ${i} - ${Math.min(i + batchSize - 1, log.idTo)}`)
      const query = queryTemplate(i, Math.min(i + batchSize - 1, log.idTo), tableAlias, exclusionScript)
      await executeQuery(query, {}, transaction)
    }

    console.log(`Processed calcOrg records for ${folder}`)
    exclusionScript += ` AND ${tableAlias}."etlId" NOT BETWEEN ${log.idFrom} AND ${log.idTo}`
  }
}

module.exports = {
  loadIntermCalcOrg
}
