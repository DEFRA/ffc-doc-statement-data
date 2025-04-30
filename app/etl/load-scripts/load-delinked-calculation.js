const db = require('../../data')
const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

const loadDelinkedCalculation = async (startDate, transaction) => {
  console.log(`loadDelinkedCalculation - startDate: ${startDate}`)

  // First check if we have data in the source table
  const sourceDataCheck = await db.sequelize.query(`
    SELECT COUNT(*) as count 
    FROM ${dbConfig.schema}."etlIntermAppCalcResultsDelinkPayments" P
    WHERE P."etlInsertedDt" > :startDate;
  `, {
    replacements: { startDate },
    raw: true,
    transaction
  })

  console.log(`loadDelinkedCalculation - Found ${sourceDataCheck[0][0].count} records to process`)

  await db.sequelize.query(`
INSERT INTO ${dbConfig.schema}."delinkedCalculation" (
    "calculationId",
    "applicationId",
    "sbi",
    "frn",
    "paymentBand1",
    "paymentBand2",
    "paymentBand3",
    "paymentBand4",
    "percentageReduction1",
    "percentageReduction2",
    "percentageReduction3",
    "percentageReduction4",
    "progressiveReductions1",
    "progressiveReductions2",
    "progressiveReductions3",
    "progressiveReductions4",
    "referenceAmount",
    "totalProgressiveReduction",
    "totalDelinkedPayment",
    "paymentAmountCalculated"
)
SELECT 
    P."calculationId",
    P."applicationId",
    CAST(P."sbi" AS INTEGER),
    CAST(P."frn" AS VARCHAR),
    SUM(CAST(P."paymentBand1" AS NUMERIC)) AS "paymentBand1",
    SUM(CAST(P."paymentBand2" AS NUMERIC)) AS "paymentBand2",
    SUM(CAST(P."paymentBand3" AS NUMERIC)) AS "paymentBand3",
    SUM(CAST(P."paymentBand4" AS NUMERIC)) AS "paymentBand4",
    SUM(CAST(P."percentageReduction1" AS NUMERIC)) AS "percentageReduction1",
    SUM(CAST(P."percentageReduction2" AS NUMERIC)) AS "percentageReduction2",
    SUM(CAST(P."percentageReduction3" AS NUMERIC)) AS "percentageReduction3",
    SUM(CAST(P."percentageReduction4" AS NUMERIC)) AS "percentageReduction4",
    SUM(CAST(P."progressiveReductions1" AS NUMERIC)) AS "progressiveReductions1",
    SUM(CAST(P."progressiveReductions2" AS NUMERIC)) AS "progressiveReductions2",
    SUM(CAST(P."progressiveReductions3" AS NUMERIC)) AS "progressiveReductions3",
    SUM(CAST(P."progressiveReductions4" AS NUMERIC)) AS "progressiveReductions4",
    SUM(CAST(P."referenceAmount" AS NUMERIC)) AS "referenceAmount",
    SUM(CAST(P."totalProgressiveReduction" AS NUMERIC)) AS "totalProgressiveReduction",
    SUM(CAST(P."totalDelinkedPayment" AS NUMERIC)) AS "totalDelinkedPayment",
    SUM(CAST(P."paymentAmountCalculated" AS NUMERIC)) AS "paymentAmountCalculated"
FROM ${dbConfig.schema}."etlIntermAppCalcResultsDelinkPayments" P
WHERE 
    P."etlInsertedDt" > :startDate
GROUP BY 
    P."calculationId", P."applicationId", P."sbi", P."frn";
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
    FROM ${dbConfig.schema}."delinkedCalculation"
    WHERE "calculationId" IN (
      SELECT "calculationId" 
      FROM ${dbConfig.schema}."etlIntermAppCalcResultsDelinkPayments" 
      WHERE "etlInsertedDt" > :startDate
    );
  `, {
    replacements: { startDate },
    raw: true,
    transaction
  })

  console.log(`loadDelinkedCalculation - Inserted ${insertedCount[0][0].count} records`)
}

module.exports = {
  loadDelinkedCalculation
}
