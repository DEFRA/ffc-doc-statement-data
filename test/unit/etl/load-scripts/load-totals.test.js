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
INSERT INTO "totals" (
      "calculationId", "sbi", "frn", "agreementNumber",
      "claimId", "schemeType", "calculationDate",
      "invoiceNumber", agreementStart, agreementEnd,
      "totalAdditionalPayments", "totalActionPayments", "updated",
      "datePublished", "totalPayments"  
    )
    SELECT
      T."calculationId" AS "calculationId",
      PO."sbi"::integer,
      PO."frn"::integer,
      CA2."applicationId" AS "agreementNumber",
      PA."applicationId" AS "claimId",
      'SFI-23' AS "schemeType",
      NOW() AS "calculationDate",
      T."invoiceid" AS "invoiceNumber",
      IPAD.agreementStart,
      IPAD.agreementEnd,
      T."totalAmount" AS "totalAdditionalPayments",
      T."totalAmount" AS "totalActionPayments",
      NOW() as "updated",
      NULL as "datePublished",
      T."totalAmount" AS "totalPayments"
    FROM "etlIntermTotal" T
    INNER JOIN "etlIntermPaymentrefOrg" PO ON PO."paymentRef" = T."paymentRef"
    INNER JOIN "etlIntermPaymentrefApplication" PA ON PA."paymentRef" = T."paymentRef"
    INNER JOIN "etlStageCssContractApplications" CA ON CA."applicationId" = PA."applicationId" AND CA."dataSourceSCode" = 'CAPCLM'
    INNER JOIN "etlStageCssContractApplications" CA2 ON CA."contractId" = CA2."contractId" AND CA2."dataSourceSCode" = '000001'
    INNER JOIN "etlIntermPaymentrefAgreementDates" IPAD ON IPAD."paymentRef" = T."paymentRef"
    WHERE T."etlInsertedDt" > :startDate
      OR PO."etlInsertedDt" > :startDate
      OR PA."etlInsertedDt" > :startDate
      OR CA."etlInsertedDt" > :startDate
      OR IPAD."etlInsertedDt" > :startDate
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
