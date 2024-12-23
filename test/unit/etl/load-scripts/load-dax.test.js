const db = require('../../../../app/data')
const { loadDAX } = require('../../../../app/etl/load-scripts/load-dax')

jest.mock('../../../../app/data', () => ({
  sequelize: {
    query: jest.fn()
  }
}))

describe('loadDAX', () => {
  const startDate = '2023-01-01'
  const transaction = {}

  beforeEach(() => {
    db.sequelize.query.mockClear()
  })

  test('should call sequelize.query with correct SQL and parameters', async () => {
    await loadDAX(startDate, transaction)

    expect(db.sequelize.query).toHaveBeenCalledWith(`
    INSERT INTO dax (
      "paymentReference", "calculationId", "paymentPeriod",
      "paymentAmount", "transactionDate"
    )
    SELECT
      T.payment_ref AS paymentReference,
      T.calculation_id AS calculationId,
      T.quarter AS paymentPeriod, 
      T.total_amount AS paymentAmount,
      T.transdate AS transactionDate 
    FROM etl_interm_total T
    WHERE T.etl_inserted_dt > :startDate;
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

    await expect(loadDAX(startDate, transaction)).rejects.toThrow('Query failed')
  })
})
