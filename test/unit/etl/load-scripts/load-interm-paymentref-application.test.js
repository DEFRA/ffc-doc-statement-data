const db = require('../../../../app/data')
const { loadIntermPaymentrefApplication } = require('../../../../app/etl/load-scripts/load-interm-paymentref-application')

jest.mock('../../../../app/data', () => ({
  sequelize: {
    query: jest.fn()
  }
}))

describe('loadIntermPaymentrefApplication', () => {
  const startDate = '2023-01-01'
  const transaction = {}

  beforeEach(() => {
    db.sequelize.query.mockClear()
  })

  test('should call sequelize.query with correct SQL and parameters', async () => {
    await loadIntermPaymentrefApplication(startDate, transaction)

    expect(db.sequelize.query).toHaveBeenCalledWith(`
    INSERT INTO etl_interm_paymentref_application(payment_ref, application_id)
    SELECT
      T.payment_ref,
      (SELECT claim_id AS application_id FROM etl_interm_finance_dax D WHERE D.payment_ref = T.payment_ref LIMIT 1)
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

    await expect(loadIntermPaymentrefApplication(startDate, transaction)).rejects.toThrow('Query failed')
  })
})
