const db = require('../../data')
const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

const loadD365 = async (startDate, transaction) => {
  await db.sequelize.query(`
    INSERT INTO ${dbConfig.schema}.d365 (
        "paymentReference", "calculationId", "paymentPeriod",
        "paymentAmount", "transactionDate", "marketingYear"
    )
    SELECT DISTINCT
        T."paymentRef" AS "paymentReference",
        T."calculationId" AS "calculationId",
        T.quarter AS "paymentPeriod", 
        D."paymentAmountCalculated"::numeric AS "paymentAmount",
        T.transdate AS "transactionDate",
        T.marketingyear AS "marketingYear" 
    FROM ${dbConfig.schema}."etlIntermTotal" T
    JOIN ${dbConfig.schema}."delinkedCalculation" D ON T."calculationId" = D."calculationId"
    WHERE T."etlInsertedDt" > :startDate;
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
