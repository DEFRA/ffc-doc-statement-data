const db = require('../../data')

const loadD365 = async (startDate, transaction) => {
  await db.sequelize.query(`
INSERT INTO "d365" (
    "paymentReference",
    "calculationId",
    "paymentPeriod",
    "paymentAmount",
    "transactionDate",
    "datePublished"
)
SELECT 
    P."calculation_id" AS "calculationId",
    P."application_id" AS "applicationId",
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
  loadD365
}
