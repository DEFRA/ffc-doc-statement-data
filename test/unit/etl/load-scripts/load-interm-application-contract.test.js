const { storageConfig } = require('../../../../app/config')
const db = require('../../../../app/data')
const { loadIntermApplicationContract } = require('../../../../app/etl/load-scripts/load-interm-application-contract')

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

describe('loadIntermApplicationContract', () => {
  const startDate = '2023-01-01'

  beforeEach(() => {
    db.etlStageLog.findAll.mockClear()
    db.sequelize.query.mockClear()
  })

  test('should throw an error if multiple records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ file: 'CSS_Contract_Applications/export.csv', idFrom: 1, idTo: 2 }, { file: 'CSS_Contract_Applications/export.csv', idFrom: 3, idTo: 4 }])

    await expect(loadIntermApplicationContract(startDate)).rejects.toThrow(
      `Multiple records found for updates to ${storageConfig.cssContractApplications.folder}, expected only one`
    )
  })

  test('should return if no records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([])

    await expect(loadIntermApplicationContract(startDate)).resolves.toBeUndefined()
    expect(db.sequelize.query).not.toHaveBeenCalled()
  })

  test('should call sequelize.query with correct SQL and parameters', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ file: 'CSS_Contract_Applications/export.csv', idFrom: 1, idTo: 2 }])

    await loadIntermApplicationContract(startDate)

    expect(db.sequelize.query).toHaveBeenCalledWith(`
    WITH newdata AS (
      SELECT
        cc."contractId",
        MIN(cc."startDt") AS "agreementStart",
        MIN(cc."endDt") AS "agreementEnd",
        ca."applicationId",
        cl.pkid,
        cl."changeType"
      FROM "etlStageCssContractApplications" cl
      LEFT JOIN "etlStageCssContractApplications" ca ON cl."contractId" = ca."contractId" AND ca."dataSourceSCode" = '000001'
      LEFT JOIN "etlStageCssContracts" cc ON cl."contractId" = cc."contractId" AND cc."contractStateSCode" = '000020'
      WHERE cl."dataSourceSCode" = 'CAPCLM'
        AND cl."etlId" BETWEEN 1 AND 2
        
      GROUP BY cc."contractId", ca."applicationId", cl."changeType", cl.pkid
    ),
    updatedrows AS (
      UPDATE "etlIntermApplicationContract" interm
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
    INSERT INTO "etlIntermApplicationContract" (
      "contractId", "agreementStart", "agreementEnd", "applicationId", pkid
    )
    SELECT "contractId", "agreementStart", "agreementEnd", "applicationId", pkid
    FROM newdata
    WHERE "changeType" = 'INSERT'
      OR ("changeType" = 'UPDATE' AND pkid NOT IN (SELECT pkid FROM updatedrows));
  `, {
      replacements: {},
      raw: true,
      transaction: undefined
    })
  })

  test('should handle errors thrown by sequelize.query', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ file: 'CSS_Contract_Applications/export.csv', idFrom: 1, idTo: 2 }])
    db.sequelize.query.mockRejectedValue(new Error('Query failed'))

    await expect(loadIntermApplicationContract(startDate)).rejects.toThrow('Query failed')
  })
})
