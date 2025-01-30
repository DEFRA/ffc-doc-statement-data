const db = require('../../../../app/data')
const { loadIntermPaymentrefAgreementDates } = require('../../../../app/etl/load-scripts/load-interm-paymentref-agreement-dates')

jest.mock('../../../../app/data', () => ({
  sequelize: {
    query: jest.fn()
  }
}))

describe('loadIntermPaymentrefAgreementDates', () => {
  const startDate = '2023-01-01'
  const transaction = {}

  beforeEach(() => {
    db.sequelize.query.mockClear()
  })

  test('should call sequelize.query with correct SQL and parameters', async () => {
    await loadIntermPaymentrefAgreementDates(startDate, transaction)

    expect(db.sequelize.query).toHaveBeenCalledWith(`
    INSERT INTO etl_interm_paymentref_agreement_dates (
      payment_ref, agreementStart, agreementEnd
    )
    SELECT
      DA.payment_ref,
      (SELECT agreementStart FROM etl_interm_application_contract IAC WHERE IAC.contract_id = CA.contract_id LIMIT 1),
      (SELECT agreementEnd FROM etl_interm_application_contract IAC WHERE IAC.contract_id = CA.contract_id LIMIT 1)
    FROM etl_interm_finance_dax DA
    INNER JOIN etl_stage_css_contract_applications CA ON CA.application_id = DA.claim_id
    INNER JOIN etl_interm_application_contract IAC ON IAC.contract_id = CA.contract_id
    WHERE DA.etl_inserted_dt > :startDate
      AND IAC.agreementStart IS NOT NULL
      AND IAC.agreementEnd IS NOT NULL
    GROUP BY DA.payment_ref, CA.contract_id
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

    await expect(loadIntermPaymentrefAgreementDates(startDate, transaction)).rejects.toThrow('Query failed')
  })
})
