const db = require('../../database')
const config = require('../../config')
const TABLES = require('../../constants/etl-tables')
const dbConfig = config.dbConfig[config.env]

const loadZeroValueD365 = async (startDate, transaction) => {
  await (transaction ?? db.client).raw(`
    WITH unique_rows AS (
      SELECT DISTINCT ON (T."paymentRef", T."calculationId")
        T."paymentRef" AS "paymentReference",
        T."calculationId" AS "calculationId",
        T.quarter AS "paymentPeriod",
        T."totalAmount" AS "paymentAmount",
        T.transdate AS "transactionDate",
        T.marketingyear AS "marketingYear"
      FROM ${dbConfig.schema}."${TABLES.etlIntermTotalZeroValues}" T
      JOIN ${dbConfig.schema}."${TABLES.delinkedCalculation}" D ON T."calculationId" = D."calculationId"
      WHERE T."etlInsertedDt" > :startDate
      ORDER BY T."paymentRef", T."calculationId", T."etlInsertedDt" DESC
    )
    INSERT INTO ${dbConfig.schema}."${TABLES.zeroValueD365}" (
      "paymentReference", "calculationId", "paymentPeriod",
      "paymentAmount", "transactionDate", "marketingYear"
    )
    SELECT 
      "paymentReference", "calculationId", "paymentPeriod",
      "paymentAmount", "transactionDate", "marketingYear"
    FROM unique_rows
  `, { startDate })
}

module.exports = {
  loadZeroValueD365
}
