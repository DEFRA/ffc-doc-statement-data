const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const { executeQuery } = require('./load-interm-utils')

const loadIntermTotalClaim = async (startDate, transaction) => {
  const query = `
    INSERT INTO ${dbConfig.schema}."etlIntermTotalClaim" ("claimId", "paymentRef")
    SELECT
      (SELECT "claimId" FROM ${dbConfig.schema}."etlIntermFinanceDax" WHERE "paymentRef" = T."paymentRef" LIMIT 1) as "applicationId",
      T."paymentRef"
    FROM ${dbConfig.schema}."etlIntermTotal" T
    WHERE T."etlInsertedDt" > :startDate
    ON CONFLICT ("claimId", "paymentRef") DO NOTHING;
  `

  await executeQuery(query, {
    startDate
  }, transaction)
}

module.exports = {
  loadIntermTotalClaim
}
