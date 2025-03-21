const db = require('../../data')
const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

const loadDelinkedCalculation = async (startDate, transaction) => {
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
    P."calculationId" AS "calculationId",
    P."applicationId" AS "applicationId",
    CAST(P."sbi" AS INTEGER),
    CAST(P."frn" AS VARCHAR),
    CAST(P."paymentBand1" AS VARCHAR),
    CAST(P."paymentBand2" AS VARCHAR),
    CAST(P."paymentBand3" AS VARCHAR),
    CAST(P."paymentBand4" AS VARCHAR),
    CAST(P."percentageReduction1" AS VARCHAR),
    CAST(P."percentageReduction2" AS VARCHAR),
    CAST(P."percentageReduction3" AS VARCHAR),
    CAST(P."percentageReduction4" AS VARCHAR),
    CAST(P."progressiveReductions1" AS VARCHAR),
    CAST(P."progressiveReductions2" AS VARCHAR),
    CAST(P."progressiveReductions3" AS VARCHAR),
    CAST(P."progressiveReductions4" AS VARCHAR),
    CAST(P."referenceAmount" AS VARCHAR),
    CAST(P."totalProgressiveReduction" AS VARCHAR),
    CAST(P."totalDelinkedPayment" AS VARCHAR),
    CAST(P."paymentAmountCalculated" AS VARCHAR)
FROM 
    ${dbConfig.schema}."etlIntermAppCalcResultsDelinkPayments" P
WHERE 
    P."etlInsertedDt" > :startDate;
  `, {
    replacements: {
      startDate
    },
    raw: true,
    transaction
  })
}

module.exports = {
  loadDelinkedCalculation
}
