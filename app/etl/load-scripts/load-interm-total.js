const db = require('../../data')

const loadIntermTotal = async (startDate, transaction) => {
  await db.sequelize.query(`
    INSERT INTO etl_interm_total (
      payment_ref, quarter, total_amount,
      transdate
    )
    SELECT payment_ref, 
      D.quarter,
      SUM(transaction_amount) * -1 as total_amount,
      transdate 
    FROM etl_interm_finance_dax D 
    WHERE D.payment_ref LIKE 'PY%' 
      AND D.etl_inserted_dt > :startDate
    GROUP BY transdate, quarter, payment_ref
    ORDER BY payment_ref;
  `, {
    replacements: {
      startDate
    },
    raw: true,
    transaction
  })
}

module.exports = {
  loadIntermTotal
}
