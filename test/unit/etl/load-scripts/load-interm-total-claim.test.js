const db = require('../../../../app/data')
const { loadIntermTotalClaim } = require('../../../../app/etl/load-scripts/load-interm-total-claim')

jest.mock('../../../../app/data', () => ({
  sequelize: {
    query: jest.fn()
  }
}))

describe('loadIntermTotalClaim', () => {
  const startDate = '2023-01-01'
  const transaction = {}

  beforeEach(() => {
    db.sequelize.query.mockClear()
  })

  test('should call sequelize.query with correct SQL and parameters', async () => {
    await loadIntermTotalClaim(startDate, transaction)

    expect(db.sequelize.query).toHaveBeenCalledWith(`
    INSERT INTO etl_interm_total_claim (claim_id, payment_ref)
    SELECT
      (SELECT claim_id FROM etl_interm_finance_dax WHERE payment_ref = T.payment_ref LIMIT 1) as application_id,
      T.payment_ref
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

    await expect(loadIntermTotalClaim(startDate, transaction)).rejects.toThrow('Query failed')
  })
})
