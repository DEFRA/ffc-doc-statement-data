const db = require('../../data')

const loadDAX = async (startDate, transaction) => {
  await db.sequelize.query(`
    INSERT INTO dax (
      "paymentReference", "calculationId", "paymentPeriod",
      "paymentAmount", "transactionDate"
    )
    SELECT
      T.payment_ref AS paymentReference,
      T.calculation_id AS calculationId,
      T.quarter AS paymentPeriod, 
      T.total_amount AS paymentAmount,
      T.transdate AS transactionDate 
    FROM etl_interm_total T
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
  loadDAX
}
