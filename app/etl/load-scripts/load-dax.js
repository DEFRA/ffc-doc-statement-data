const db = require('../../data')
const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

const loadDAX = async (startDate, transaction) => {
  await db.sequelize.query(`
    WITH unique_rows AS (
      SELECT DISTINCT ON (T."paymentRef", T."calculationId")
        T."paymentRef" AS "paymentReference",
        T."calculationId" AS "calculationId",
        T.quarter AS "paymentPeriod",
        T."totalAmount" AS "paymentAmount",
        T.transdate AS "transactionDate"
      FROM ${dbConfig.schema}."etlIntermTotal" T
      LEFT JOIN ${dbConfig.schema}."delinkedCalculation" D ON T."calculationId" = D."calculationId"
      WHERE T."etlInsertedDt" > :startDate
        AND D."calculationId" IS NULL
      ORDER BY T."paymentRef", T."calculationId", T."etlInsertedDt" DESC
    )
    INSERT INTO ${dbConfig.schema}.dax (
      "paymentReference", "calculationId", "paymentPeriod",
      "paymentAmount", "transactionDate"
    )
    SELECT 
      "paymentReference", "calculationId", "paymentPeriod",
      "paymentAmount", "transactionDate"
    FROM unique_rows
    ON CONFLICT ("paymentReference", "calculationId")
    DO UPDATE SET
      "paymentAmount" = EXCLUDED."paymentAmount",
      "datePublished" = NULL;
;
  `, {
    replacements: {
      startDate
    },
    raw: true,
    transaction
  })
}

module.exports = {
  loadDAX
}
