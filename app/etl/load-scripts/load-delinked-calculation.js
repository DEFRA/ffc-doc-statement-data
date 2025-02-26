const db = require('../../data')

const loadDelinkedCalculation = async (startDate, transaction) => {
  await db.sequelize.query(`
INSERT INTO "delinkedCalculation" (
    "calculationId",
    "applicationId",
    sbi,
    frn,
    paymentBand1,
    paymentBand2,
    paymentBand3,
    paymentBand4,
    percentageReduction1,
    percentageReduction2,
    percentageReduction3,
    percentageReduction4,
    progressiveReductions1,
    progressiveReductions2,
    progressiveReductions3,
    progressiveReductions4,
    referenceAmount,
    totalProgressiveReduction,
    totalDelinkedPayment,
    paymentAmountCalculated
)INSERT INTO "delinkedCalculation" (
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
    P."calculation_id" AS "calculationId",
    P."application_id" AS "applicationId",
    P."sbi",
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
    etl_interm_app_calc_results_delink_payments P
WHERE 
    P.etl_inserted_dt > :startDate;
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
