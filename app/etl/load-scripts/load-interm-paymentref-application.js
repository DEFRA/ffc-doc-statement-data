const config = require('../../config')
const TABLES = require('../../constants/etl-tables')
const dbConfig = config.dbConfig[config.env]
const { executeQuery } = require('./load-interm-utils')

const loadIntermPaymentrefApplication = async (startDate, transaction) => {
  const query = `
    INSERT INTO ${dbConfig.schema}."${TABLES.etlIntermPaymentrefApplication}"("paymentRef", "applicationId")
    SELECT DISTINCT ON (T."paymentRef")
      T."paymentRef",
      D."claimId" AS "applicationId"
    FROM ${dbConfig.schema}."${TABLES.etlIntermTotal}" T
    JOIN ${dbConfig.schema}."${TABLES.etlIntermFinanceDax}" D
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
