const config = require('../../config')
const etlConfig = config.etlConfig
const dbConfig = config.dbConfig[config.env]
const { getEtlStageLogs, executeQuery } = require('./load-interm-utils')

const defaultTablesToCheck = [
  etlConfig.cssContractApplications.folder,
  etlConfig.cssContract.folder
]

const defaultFolderToAliasMap = {
  [etlConfig.cssContractApplications.folder]: 'cl',
  [etlConfig.cssContract.folder]: 'cc'
}

const loadIntermApplicationClaim = async (startDate, transaction, tablesToCheck = defaultTablesToCheck, folderToAliasMap = defaultFolderToAliasMap) => {
  const etlStageLogs = await getEtlStageLogs(startDate, tablesToCheck)

  if (!etlStageLogs.length) {
    return
  }

  const queryTemplate = (idFrom, idTo, tableAlias, exclusionCondition) => `
    WITH newdata AS (
      SELECT
        cc."contractId",
        ca."applicationId" AS "claimId",
        ca."applicationId" AS "agreementId",
        cl.pkid,
        ${tableAlias}."changeType"
      FROM ${dbConfig.schema}."etlStageCssContractApplications" cl
      LEFT JOIN ${dbConfig.schema}."etlStageCssContractApplications" ca ON cl."contractId" = ca."contractId" AND ca."dataSourceSCode" = '000001'
      LEFT JOIN ${dbConfig.schema}."etlStageCssContracts" cc ON cl."contractId" = cc."contractId"
      WHERE cl."dataSourceSCode" = 'CAPCLM'
        AND ${tableAlias}."etlId" BETWEEN ${idFrom} AND ${idTo}
        ${exclusionCondition}
      GROUP BY cc."contractId", cc."startDt", cc."endDt", ca."applicationId", ${tableAlias}."changeType", cl.pkid
    ),
    updatedrows AS (
      UPDATE ${dbConfig.schema}."etlIntermApplicationClaim" interm
      SET
        "contractId" = newdata."contractId",
        "claimId" = newdata."claimId",
        "agreementId" = newdata."agreementId",
        "etlInsertedDt" = NOW()
      FROM newdata
      WHERE newdata."changeType" = 'UPDATE'
        AND interm.pkid = newdata.pkid
      RETURNING interm.pkid
    )
    INSERT INTO ${dbConfig.schema}."etlIntermApplicationClaim" (
      "contractId", "claimId", "agreementId", pkid
    )
    SELECT "contractId", "claimId", "agreementId", pkid
    FROM newdata
    WHERE "changeType" = 'INSERT'
      OR ("changeType" = 'UPDATE' AND pkid NOT IN (SELECT pkid FROM updatedrows));
  `

  const batchSize = etlConfig.etlBatchSize
  let exclusionScript = ''
  for (const log of etlStageLogs) {
    const folderMatch = log.file.match(/^(.*)\/export\.csv$/)
    const folder = folderMatch ? folderMatch[1] : ''
    const tableAlias = folderToAliasMap[folder]

    for (let i = log.idFrom; i <= log.idTo; i += batchSize) {
      console.log(`Processing application claim records for ${folder} ${i} to ${Math.min(i + batchSize - 1, log.idTo)}`)
      const query = queryTemplate(i, Math.min(i + batchSize - 1, log.idTo), tableAlias, exclusionScript)
      await executeQuery(query, {}, transaction)
    }

    console.log(`Processed application claim records for ${folder}`)
    exclusionScript += ` AND ${tableAlias}."etlId" NOT BETWEEN ${log.idFrom} AND ${log.idTo}`
  }
}

const loadIntermApplicationClaimDelinked = async (startDate, transaction) => {
  const tablesToCheck = [
    etlConfig.cssContractApplicationsDelinked.folder,
    etlConfig.cssContractDelinked.folder
  ]

  const folderToAliasMap = {
    [etlConfig.cssContractApplicationsDelinked.folder]: 'cl',
    [etlConfig.cssContractDelinked.folder]: 'cc'
  }

  return loadIntermApplicationClaim(startDate, transaction, tablesToCheck, folderToAliasMap)
}

module.exports = {
  loadIntermApplicationClaim,
  loadIntermApplicationClaimDelinked
}
