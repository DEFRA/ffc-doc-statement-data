const config = require('../../config')
const TABLES = require('../../constants/etl-tables')
const dbConfig = config.dbConfig[config.env]
const { executeQuery } = require('./load-interm-utils')

const loadIntermTotalClaim = async (startDate, transaction) => {
  const query = `
    INSERT INTO ${dbConfig.schema}."${TABLES.etlIntermTotalClaim}" ("claimId", "paymentRef")
    SELECT
      (SELECT "claimId" FROM ${dbConfig.schema}."${TABLES.etlIntermFinanceDax}" WHERE "paymentRef" = T."paymentRef" LIMIT 1) as "applicationId",
      T."paymentRef"
    FROM ${dbConfig.schema}."${TABLES.etlIntermTotal}" T
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
