const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const { executeQuery } = require('./load-interm-utils')

const loadIntermPaymentrefApplication = async (startDate, transaction) => {
  const query = `
    INSERT INTO ${dbConfig.schema}."etlIntermPaymentrefApplication"("paymentRef", "applicationId")
    SELECT DISTINCT ON (T."paymentRef")
      T."paymentRef",
      D."claimId" AS "applicationId"
    FROM ${dbConfig.schema}."etlIntermTotal" T
    JOIN ${dbConfig.schema}."etlIntermFinanceDax" D
      ON D."paymentRef" = T."paymentRef"
      AND POSITION(D."claimId"::text IN T."invoiceid") > 0
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
