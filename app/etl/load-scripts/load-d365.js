const db = require('../../data')
const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

const loadD365 = async (startDate, transaction) => {
  await db.sequelize.query(`
    WITH unique_rows AS (
      SELECT DISTINCT ON (T."paymentRef", T."calculationId")
        T."paymentRef" AS "paymentReference",
        T."calculationId" AS "calculationId",
        T.quarter AS "paymentPeriod",
        T."totalAmount" AS "paymentAmount",
        T.transdate AS "transactionDate",
        T.marketingyear AS "marketingYear"
      FROM ${dbConfig.schema}."etlIntermTotal" T
      JOIN ${dbConfig.schema}."delinkedCalculation" D ON T."calculationId" = D."calculationId"
      WHERE T."etlInsertedDt" > :startDate
      ORDER BY T."paymentRef", T."calculationId", T."etlInsertedDt" DESC
    )
    INSERT INTO ${dbConfig.schema}.d365 (
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
  `, {
    replacements: {
      startDate
    },
    raw: true,
    transaction
  })
}

module.exports = {
  loadD365
}
