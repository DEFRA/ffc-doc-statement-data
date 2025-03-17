const { storageConfig } = require('../../config')
const { getEtlStageLogs, executeQuery } = require('./load-interm-utils')

const loadIntermApplicationContract = async (startDate, transaction) => {
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
    WITH newData AS (
      SELECT
        cc.contractId,
        MIN(cc.startDt) AS agreementStart,
        MIN(cc.endDt) AS agreementEnd,
        ca.applicationId,
        cl.pkid,
        ${tableAlias}.changeType
      FROM etlStageCssContractApplications cl
      LEFT JOIN etlStageCssContractApplications ca ON cl.contractId = ca.contractId AND ca.dataSourceSCode = '000001'
      LEFT JOIN etlStageCssContracts cc ON cl.contractId = cc.contractId AND cc.contractStateSCode = '000020'
      WHERE cl.dataSourceSCode = 'CAPCLM'
        AND ${tableAlias}.etlId BETWEEN ${idFrom} AND ${idTo}
        ${exclusionCondition}
      GROUP BY cc.contractId, ca.applicationId, ${tableAlias}.changeType, cl.pkid
    ),
    updatedRows AS (
      UPDATE etlIntermApplicationContract interm
      SET
        contractId = newData.contractId,
        agreementStart = newData.agreementStart,
        agreementEnd = newData.agreementEnd,
        applicationId = newData.applicationId,
        etlInsertedDt = NOW()
      FROM newData
      WHERE newData.changeType = 'UPDATE'
        AND interm.pkid = newData.pkid
      RETURNING interm.pkid
    )
    INSERT INTO etlIntermApplicationContract (
      contractId, agreementStart, agreementEnd, applicationId, pkid
    )
    SELECT contractId, agreementStart, agreementEnd, applicationId, pkid
    FROM newData
    WHERE changeType = 'INSERT'
      OR (changeType = 'UPDATE' AND pkid NOT IN (SELECT pkid FROM updatedRows));
  `

  const batchSize = storageConfig.etlBatchSize
  let exclusionScript = ''
  for (const log of etlStageLogs) {
    const folderMatch = log.file.match(/^(.*)\/export\.csv$/)
    const folder = folderMatch ? folderMatch[1] : ''
    const tableAlias = folderToAliasMap[folder]

    for (let i = log.idFrom; i <= log.idTo; i += batchSize) {
      console.log(`Processing application contract records for ${folder} ${i} to ${Math.min(i + batchSize - 1, log.idTo)}`)
      const query = queryTemplate(i, Math.min(i + batchSize - 1, log.idTo), tableAlias, exclusionScript)
      await executeQuery(query, {}, transaction)
    }

    console.log(`Processed application claim records for ${folder}}`)
    exclusionScript += ` AND ${tableAlias}.etlId NOT BETWEEN ${log.idFrom} AND ${log.idTo}`
  }
}

module.exports = {
  loadIntermApplicationContract
}
