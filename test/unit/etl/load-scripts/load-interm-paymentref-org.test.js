const db = require('../../../../app/data')
const { loadIntermPaymentrefOrg } = require('../../../../app/etl/load-scripts/load-interm-paymentref-org')

jest.mock('../../../../app/data', () => ({
  sequelize: {
    query: jest.fn()
  }
}))

describe('loadIntermPaymentrefOrg', () => {
  const startDate = '2023-01-01'
  const transaction = {}

  beforeEach(() => {
    db.sequelize.query.mockClear()
  })

  test('should call sequelize.query with correct SQL and parameters', async () => {
    await loadIntermPaymentrefOrg(startDate, transaction)

    expect(db.sequelize.query).toHaveBeenCalledWith(`
    INSERT INTO "etlIntermPaymentrefOrg" ("paymentRef", sbi, frn)
    SELECT PA."paymentRef", O.sbi, O.frn::bigint 
      FROM "etlIntermPaymentrefApplication" PA 
    INNER JOIN "etlIntermCalcOrg" O ON O."applicationId" = PA."applicationId"
    WHERE PA."etlInsertedDt" > :startDate
      OR O."etlInsertedDt" > :startDate
    GROUP BY PA."paymentRef", O.sbi, O.frn;
  `, {
      replacements: {
        startDate
      },
      raw: true,
      transaction
    })
  })

  test('should handle errors thrown by sequelize.query', async () => {
    db.sequelize.query.mockRejectedValue(new Error('Query failed'))

    await expect(loadIntermPaymentrefOrg(startDate, transaction)).rejects.toThrow('Query failed')
  })
})
