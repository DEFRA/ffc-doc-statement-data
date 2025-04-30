const db = require('../../data')
const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

const loadD365 = async (startDate, transaction) => {
  console.log(`loadD365 - startDate: ${startDate}`)

  // First check if we have data in the source tables
  const sourceDataCheck = await db.sequelize.query(`
    SELECT COUNT(*) as count 
    FROM ${dbConfig.schema}."etlIntermTotal" T
    JOIN ${dbConfig.schema}."delinkedCalculation" D ON T."calculationId" = D."calculationId"
    WHERE T."etlInsertedDt" > :startDate;
  `, {
    replacements: { startDate },
    raw: true,
    transaction
  })

  console.log(`loadD365 - Found ${sourceDataCheck[0][0].count} records to process`)

  await db.sequelize.query(`
    INSERT INTO ${dbConfig.schema}.d365 (
        "paymentReference", "calculationId", "paymentPeriod",
        "paymentAmount", "transactionDate"
    )
    SELECT DISTINCT
        T."paymentRef" AS "paymentReference",
        T."calculationId" AS "calculationId",
        T.quarter AS "paymentPeriod", 
        T."totalAmount" AS "paymentAmount",
        T.transdate AS "transactionDate" 
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

  // Verify the insert worked
  const insertedCount = await db.sequelize.query(`
    SELECT COUNT(*) as count 
    FROM ${dbConfig.schema}.d365
    WHERE "transactionDate" > :startDate;
  `, {
    replacements: { startDate },
    raw: true,
    transaction
  })

  console.log(`loadD365 - Inserted ${insertedCount[0][0].count} records`)
}

module.exports = {
  loadD365
}
