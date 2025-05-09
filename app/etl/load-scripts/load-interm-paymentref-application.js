const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const { executeQuery } = require('./load-interm-utils')

const loadIntermPaymentrefApplication = async (startDate, transaction) => {
  const query = `
    INSERT INTO ${dbConfig.schema}."etlIntermPaymentrefApplication"("paymentRef", "applicationId")
    SELECT
      T."paymentRef",
      (SELECT "claimId" AS "applicationId" FROM ${dbConfig.schema}."etlIntermFinanceDax" D WHERE D."paymentRef" = T."paymentRef" LIMIT 1)
    FROM ${dbConfig.schema}."etlIntermTotal" T
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
