const { storageConfig } = require('../../../../app/config')
const db = require('../../../../app/data')
const { loadIntermApplicationClaim } = require('../../../../app/etl/load-scripts/load-interm-application-claim')

jest.mock('../../../../app/data', () => ({
  sequelize: {
    query: jest.fn()
  },
  etlStageLog: {
    findAll: jest.fn()
  },
  Sequelize: {
    Op: {
      gt: Symbol('gt')
    }
  }
}))

describe('loadIntermApplicationClaim', () => {
  const startDate = '2023-01-01'

  beforeEach(() => {
    db.etlStageLog.findAll.mockClear()
    db.sequelize.query.mockClear()
  })

  test('should throw an error if multiple records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ file: 'CSS_Contract_Applications/export.csv', idFrom: 1, idTo: 2 }, { file: 'CSS_Contract_Applications/export.csv', idFrom: 3, idTo: 4 }])

    await expect(loadIntermApplicationClaim(startDate)).rejects.toThrow(
      `Multiple records found for updates to ${storageConfig.cssContractApplications.folder}, expected only one`
    )
  })

  test('should return if no records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([])

    await expect(loadIntermApplicationClaim(startDate)).resolves.toBeUndefined()
    expect(db.sequelize.query).not.toHaveBeenCalled()
  })

  test('should call sequelize.query with correct SQL and parameters', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ file: 'CSS_Contract_Applications/export.csv', idFrom: 1, idTo: 2 }])

    await loadIntermApplicationClaim(startDate)

    expect(db.sequelize.query).toHaveBeenCalledWith(`
    WITH newData AS (
      SELECT
        cc.contractId,
        ca.applicationId AS claimId,
        ca.applicationId AS agreementId,
        cl.pkid,
        cl.changeType
      FROM etlStageCssContractApplications cl
      LEFT JOIN etlStageCssContractApplications ca ON cl.contractId = ca.contractId AND ca.dataSourceSCode = '000001'
      LEFT JOIN etlStageCssContracts cc ON cl.contractId = cc.contractId
      WHERE cl.dataSourceSCode = 'CAPCLM'
        AND cl.etlId BETWEEN 1 AND 2
        
      GROUP BY cc.contractId, cc.startDt, cc.endDt, ca.applicationId, cl.changeType, cl.pkid
    ),
    updatedRows AS (
      UPDATE etlIntermApplicationClaim interm
      SET
        contractId = newData.contractId,
        claimId = newData.claimId,
        agreementId = newData.agreementId,
        etlInsertedDt = NOW()
      FROM newData
      WHERE newData.changeType = 'UPDATE'
        AND interm.pkid = newData.pkid
      RETURNING interm.pkid
    )
    INSERT INTO etlIntermApplicationClaim (
      contractId, claimId, agreementId, pkid
    )
    SELECT contractId, claimId, agreementId, pkid
    FROM newData
    WHERE changeType = 'INSERT'
      OR (changeType = 'UPDATE' AND pkid NOT IN (SELECT pkid FROM updatedRows));
  `, {
      replacements: {},
      raw: true,
      transaction: undefined
    })
  })

  test('should handle errors thrown by sequelize.query', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ file: 'CSS_Contract_Applications/export.csv', idFrom: 1, idTo: 2 }])
    db.sequelize.query.mockRejectedValue(new Error('Query failed'))

    await expect(loadIntermApplicationClaim(startDate)).rejects.toThrow('Query failed')
  })
})
