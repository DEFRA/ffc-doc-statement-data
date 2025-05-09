const config = require('../../config')
const etlConfig = config.etlConfig
const dbConfig = config.dbConfig[config.env]
const { getEtlStageLogs, processWithWorkers } = require('./load-interm-utils')

const loadIntermApplicationContract = async (startDate, transaction) => {
  const tablesToCheck = [
    etlConfig.cssContractApplications.folder,
    etlConfig.cssContract.folder
  ]

  const folderToAliasMap = {
    [etlConfig.cssContractApplications.folder]: 'cl',
    [etlConfig.cssContract.folder]: 'cc'
  }

  const etlStageLogs = await getEtlStageLogs(startDate, tablesToCheck)

  if (!etlStageLogs.length) {
    return
  }

  const queryTemplate = (idFrom, idTo, tableAlias, exclusionCondition) => `
    WITH newdata AS (
      SELECT
        cc."contractId",
        MIN(cc."startDt") AS "agreementStart",
        MIN(cc."endDt") AS "agreementEnd",
        ca."applicationId",
        cl.pkid,
        ${tableAlias}."changeType"
      FROM ${dbConfig.schema}."etlStageCssContractApplications" cl
      INNER JOIN ${dbConfig.schema}."etlStageCssContractApplications" ca ON cl."contractId" = ca."contractId" AND ca."dataSourceSCode" = '000001'
      INNER JOIN ${dbConfig.schema}."etlStageCssContracts" cc ON cl."contractId" = cc."contractId" AND cc."contractStateSCode" = '000020'
      WHERE cl."dataSourceSCode" = 'CAPCLM'
        AND ${tableAlias}."etlId" BETWEEN ${idFrom} AND ${idTo}
        ${exclusionCondition}
      GROUP BY cc."contractId", ca."applicationId", ${tableAlias}."changeType", cl.pkid
    ),
    updatedrows AS (
      UPDATE ${dbConfig.schema}."etlIntermApplicationContract" interm
      SET
        "contractId" = newdata."contractId",
        "agreementStart" = newdata."agreementStart",
        "agreementEnd" = newdata."agreementEnd",
        "applicationId" = newdata."applicationId",
        "etlInsertedDt" = NOW()
      FROM newdata
      WHERE newdata."changeType" = 'UPDATE'
        AND interm.pkid = newdata.pkid
      RETURNING interm.pkid
    )
    INSERT INTO ${dbConfig.schema}."etlIntermApplicationContract" (
      "contractId", "agreementStart", "agreementEnd", "applicationId", pkid
    )
    SELECT "contractId", "agreementStart", "agreementEnd", "applicationId", pkid
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

    await processWithWorkers({ query: null, batchSize, idFrom: log.idFrom, idTo: log.idTo, transaction, recordType: `application contract records for folder ${folder}`, queryTemplate, exclusionScript, tableAlias })

    console.log(`Processed application claim records for ${folder}`)
    exclusionScript += ` AND ${tableAlias}."etlId" NOT BETWEEN ${log.idFrom} AND ${log.idTo}`
  }
}

module.exports = {
  loadIntermApplicationContract
}
