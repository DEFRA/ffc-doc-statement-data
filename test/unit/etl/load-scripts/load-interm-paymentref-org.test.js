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
    INSERT INTO etl_interm_paymentref_org (payment_ref, sbi, frn)
    SELECT PA.payment_ref, O.sbi, O.frn::bigint 
      FROM etl_interm_paymentref_application PA 
    INNER JOIN etl_interm_calc_org O ON O.application_id = PA.application_id
    WHERE PA.etl_inserted_dt > :startDate
    GROUP BY PA.payment_ref, O.sbi, O.frn;
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
