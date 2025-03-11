const db = require('../../data')

const loadD365 = async (startDate, transaction) => {
  await db.sequelize.query(`
    INSERT INTO d365 (
        "paymentReference", "calculationId", "paymentPeriod",
        "paymentAmount", "transactionDate"
    )
    SELECT DISTINCT
        T.payment_ref AS paymentReference,
        T.calculation_id AS calculationId,
        T.quarter AS paymentPeriod, 
        T.total_amount AS paymentAmount,
        T.transdate AS transactionDate 
    FROM etl_interm_total T
    JOIN "delinkedCalculation" D ON T.calculation_id = D."calculationId"
    WHERE T.etl_inserted_dt > :startDate;
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
