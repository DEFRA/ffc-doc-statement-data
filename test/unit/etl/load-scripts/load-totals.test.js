const db = require('../../../../app/data')
const { loadTotals } = require('../../../../app/etl/load-scripts/load-totals')

jest.mock('../../../../app/data')

describe('loadTotals', () => {
  let mockTransaction

  beforeEach(() => {
    mockTransaction = {} // Mock transaction object
    db.sequelize.query.mockClear()
  })

  test('should call sequelize.query with correct parameters', async () => {
    const startDate = new Date('2023-01-01')

    await loadTotals(startDate, mockTransaction)

    const expected = `
    INSERT INTO totals (
      "calculationId", "sbi", "frn", "agreementNumber",
      "claimId", "schemeType", "calculationDate",
      "invoiceNumber", "agreementStart", "agreementEnd",
      "totalAdditionalPayments", "totalActionPayments", "updated",
      "datePublished", "totalPayments"  
    )
    SELECT
      T.calculation_id AS calculationId,
      PO.sbi::integer,
      PO.frn::integer,
      CA2.application_id AS agreementNumber,
      PA.application_id AS claimId,
      'SFI-23' AS schemeType,
      NOW() AS calculationDate,
      T.invoiceid AS invoiceNumber,
      IPAD.agreementStart,
      IPAD.agreementEnd,
      T.total_amount AS totalAdditionalPayments,
      T.total_amount AS totalActionPayments,
      NOW() as updated,
      NULL as datePublished,
      T.total_amount AS totalPayments
    FROM etl_interm_total T
    INNER JOIN etl_interm_paymentref_org PO ON PO.payment_ref = T.payment_ref
    INNER JOIN etl_interm_paymentref_application PA ON PA.payment_ref = T.payment_ref
    INNER JOIN etl_stage_css_contract_applications CA ON CA.application_id = PA.application_id AND CA.data_source_s_code = 'CAPCLM'
    INNER JOIN etl_stage_css_contract_applications CA2 ON CA.contract_id = CA2.contract_id AND CA2.data_source_s_code = '000001'
    INNER JOIN etl_interm_paymentref_agreement_dates IPAD ON IPAD.payment_ref = T.payment_ref
    WHERE T.etl_inserted_dt > :startDate
      OR PO.etl_inserted_dt > :startDate
      OR PA.etl_inserted_dt > :startDate
      OR CA.etl_inserted_dt > :startDate
      OR IPAD.etl_inserted_dt > :startDate
    ON CONFLICT ("calculationId") DO NOTHING;
  `

    expect(db.sequelize.query).toHaveBeenCalledWith(expected,
      {
        replacements: { startDate },
        raw: true,
        transaction: mockTransaction
      }
    )
  })
})
