const { executeQuery } = require('./load-interm-utils')

const loadIntermPaymentrefApplication = async (startDate, transaction) => {
  const query = `
    INSERT INTO "etlIntermPaymentrefApplication"("paymentRef", "applicationId")
    SELECT
      T."paymentRef",
      (SELECT "claimId" AS "applicationId" FROM "etlIntermFinanceDax" D WHERE D."paymentRef" = T."paymentRef" LIMIT 1)
    FROM "etlIntermTotal" T
    WHERE T."etlInsertedDt" > :startDate
    ON CONFLICT ("paymentRef", "applicationId") DO NOTHING;
  `

  await executeQuery(query, {
    startDate
  }, transaction)
}

module.exports = {
  loadIntermPaymentrefApplication
}
