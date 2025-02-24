const db = require('../../data')

//TODO missing sbi and frn... need to find what to join on to get these
// also mapping needs to be looked at
// could     referenceAmount: "CUR_REF_AMOUNT" or "CUR_TOT_REF_AMO"?

const loadDelinkedCalculation = async (startDate, transaction) => {
  await db.sequelize.query(`
INSERT INTO delinkedCalculation (
    calculation_id,
    application_id,
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
)
SELECT 
    r.calculation_id,
    d.application_id,
    MAX(CASE WHEN r.variable_name = 'PI_BPS_BAND1' THEN r.value ELSE '' END) AS paymentBand1,
    MAX(CASE WHEN r.variable_name = 'PI_BPS_BAND2' THEN r.value ELSE '' END) AS paymentBand2,
    MAX(CASE WHEN r.variable_name = 'PI_BPS_BAND3' THEN r.value ELSE '' END) AS paymentBand3,
    MAX(CASE WHEN r.variable_name = 'PI_BPS_BAND4' THEN r.value ELSE '' END) AS paymentBand4,
    MAX(CASE WHEN r.variable_name = 'PI_BPS_BANDPRC1' THEN r.value ELSE '' END) AS percentageReduction1,
    MAX(CASE WHEN r.variable_name = 'PI_BPS_BANDPRC2' THEN r.value ELSE '' END) AS percentageReduction2,
    MAX(CASE WHEN r.variable_name = 'PI_BPS_BANDPRC3' THEN r.value ELSE '' END) AS percentageReduction3,
    MAX(CASE WHEN r.variable_name = 'PI_BPS_BANDPRC4' THEN r.value ELSE '' END) AS percentageReduction4,
    MAX(CASE WHEN r.variable_name = 'PROG_RED_BAND_1' THEN r.value ELSE '' END) AS progressiveReductions1,
    MAX(CASE WHEN r.variable_name = 'PROG_RED_BAND_2' THEN r.value ELSE '' END) AS progressiveReductions2,
    MAX(CASE WHEN r.variable_name = 'PROG_RED_BAND_3' THEN r.value ELSE '' END) AS progressiveReductions3,
    MAX(CASE WHEN r.variable_name = 'PROG_RED_BAND_4' THEN r.value ELSE '' END) AS progressiveReductions4,
    MAX(CASE WHEN r.variable_name = 'CUR_REF_AMOUNT' THEN r.value ELSE '' END) AS referenceAmount,
    MAX(CASE WHEN r.variable_name = 'TOT_PRO_RED_AMO' THEN r.value ELSE '' END) AS totalProgressiveReduction,
    MAX(CASE WHEN r.variable_name = 'CUR_TOT_REF_AMO' THEN r.value ELSE '' END) AS totalDelinkedPayment,
    MAX(CASE WHEN r.variable_name = 'NE_TOT_AMOUNT' THEN r.value ELSE '' END) AS paymentAmountCalculated
FROM 
    etlStageAppCalcResultsDelinkPayment r
JOIN 
    etlStageCalculationDetails d ON r.calculation_id = d.calculation_id
WHERE 
    r.etl_inserted_dt > :startDate
GROUP BY 
    r.calculation_id, d.application_id;
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
