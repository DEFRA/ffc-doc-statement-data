const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const { executeQuery } = require('./load-interm-utils')

const loadZeroTotals = async (startDate, transaction) => {
  const query = `
    INSERT INTO ${dbConfig.schema}."zeroTotals" (
      "calculationId", "sbi", "frn", "agreementNumber",
      "claimId", "schemeType", "calculationDate",
      "invoiceNumber", "agreementStart", "agreementEnd",
      "totalAdditionalPayments", "totalActionPayments", "updated",
      "datePublished", "totalPayments"  
    )
    SELECT
      T."calculationId" AS "calculationId",
      PO.sbi::integer,
      PO.frn::integer,
      CA2."applicationId" AS "agreementNumber",
      PA."applicationId" AS "claimId",
      'SFI-23' AS "schemeType",
      NOW() AS "calculationDate",
      T.invoiceid AS "invoiceNumber",
      IPAD."agreementStart",
      IPAD."agreementEnd",
      T."totalAmount" AS "totalAdditionalPayments",
      T."totalAmount" AS "totalActionPayments",
      NOW() as updated,
      NULL as "datePublished",
      T."totalAmount" AS "totalPayments"
    FROM ${dbConfig.schema}."etlIntermTotalZeroValues" T
    INNER JOIN ${dbConfig.schema}."etlIntermPaymentrefOrg" PO ON PO."paymentRef" = T."paymentRef"
    INNER JOIN ${dbConfig.schema}."etlIntermPaymentrefApplication" PA ON PA."paymentRef" = T."paymentRef" AND POSITION(PA."applicationId"::text IN T.invoiceid) > 0
    INNER JOIN ${dbConfig.schema}."etlStageCssContractApplications" CA ON CA."applicationId" = PA."applicationId" AND CA."dataSourceSCode" = 'CAPCLM'
    INNER JOIN ${dbConfig.schema}."etlStageCssContractApplications" CA2 ON CA."contractId" = CA2."contractId" AND CA2."dataSourceSCode" = '000001'
    INNER JOIN ${dbConfig.schema}."etlIntermPaymentrefAgreementDates" IPAD ON IPAD."paymentRef" = T."paymentRef"
    WHERE T."etlInsertedDt" > :startDate
      OR PO."etlInsertedDt" > :startDate
      OR PA."etlInsertedDt" > :startDate
      OR CA."etlInsertedDt" > :startDate
      OR IPAD."etlInsertedDt" > :startDate
    ON CONFLICT ("calculationId") DO NOTHING;
  `

  await executeQuery(query, {
    startDate
  }, transaction)
}

module.exports = {
  loadZeroTotals
} 