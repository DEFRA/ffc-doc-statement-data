const db = require('../../database')
const config = require('../../config')
const TABLES = { ...require('../../constants/etl-tables'), ...require('../../constants/tables') }
const dbConfig = config.dbConfig[config.env]

const loadD365 = async (startDate, transaction) => {
  await (transaction ?? db.client).raw(`
    WITH unique_rows AS (
      SELECT DISTINCT ON (T."paymentRef", T."calculationId")
        T."paymentRef" AS "paymentReference",
        T."calculationId" AS "calculationId",
        T.quarter AS "paymentPeriod",
        T."totalAmount" AS "paymentAmount",
        T.transdate AS "transactionDate",
        T.marketingyear AS "marketingYear"
      FROM ${dbConfig.schema}."${TABLES.etlIntermTotal}" T
      JOIN ${dbConfig.schema}."${TABLES.delinkedCalculation}" D ON T."calculationId" = D."calculationId"
      WHERE T."etlInsertedDt" > :startDate
      ORDER BY T."paymentRef", T."calculationId", T."etlInsertedDt" DESC
    )
    INSERT INTO ${dbConfig.schema}.${TABLES.d365} (
      "paymentReference", "calculationId", "paymentPeriod",
      "paymentAmount", "transactionDate", "marketingYear"
    )
    SELECT 
      "paymentReference", "calculationId", "paymentPeriod",
      "paymentAmount", "transactionDate", "marketingYear"
    FROM unique_rows
    ON CONFLICT ("paymentReference", "calculationId")
    DO UPDATE SET
      "paymentAmount" = EXCLUDED."paymentAmount",
      "datePublished" = NULL;
  `, { startDate })
}

module.exports = {
  loadD365
}
