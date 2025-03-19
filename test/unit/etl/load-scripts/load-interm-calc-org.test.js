const { storageConfig } = require('../../../../app/config')
const db = require('../../../../app/data')
const { loadIntermCalcOrg } = require('../../../../app/etl/load-scripts/load-interm-calc-org')

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

describe('loadIntermCalcOrg', () => {
  const startDate = '2023-01-01'

  beforeEach(() => {
    db.etlStageLog.findAll.mockClear()
    db.sequelize.query.mockClear()
  })

  test('should throw an error if multiple records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ file: 'Apps_Payment_Notification/export.csv', idFrom: 1, idTo: 2 }, { file: 'Apps_Payment_Notification/export.csv', idFrom: 3, idTo: 4 }])

    await expect(loadIntermCalcOrg(startDate)).rejects.toThrow(
      `Multiple records found for updates to ${storageConfig.appsPaymentNotification.folder}, expected only one`
    )
  })

  test('should return if no records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([])

    await expect(loadIntermCalcOrg(startDate)).resolves.toBeUndefined()
    expect(db.sequelize.query).not.toHaveBeenCalled()
  })

  test('should call sequelize.query with correct SQL and parameters', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ file: 'Apps_Payment_Notification/export.csv', idFrom: 1, idTo: 2 }])

    await loadIntermCalcOrg(startDate)

    expect(db.sequelize.query).toHaveBeenCalledWith(`
    WITH "newData" AS (
      SELECT
        CD."calculationId",
        BAC."sbi",
        BAC."frn",
        CD."applicationId",
        CD."calculationDt",
        CD."idClcHeader",
        APN."changeType"
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
        AND APN."etlId" BETWEEN 1 AND 2
        
      GROUP BY CD."calculationId", BAC."sbi", BAC."frn", CD."applicationId", CD."calculationDt", CD."idClcHeader", APN."changeType"
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
  `, {
      replacements: {},
      raw: true,
      transaction: undefined
    })
  })

  test('should handle errors thrown by sequelize.query', async () => {
    db.etlStageLog.findAll.mockResolvedValue([{ file: 'Apps_Payment_Notification/export.csv', idFrom: 1, idTo: 2 }])
    db.sequelize.query.mockRejectedValue(new Error('Query failed'))

    await expect(loadIntermCalcOrg(startDate)).rejects.toThrow('Query failed')
  })
})
