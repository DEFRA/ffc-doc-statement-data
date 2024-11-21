const db = require('../../data')

const loadIntermTotalClaim = async (startDate, transaction) => {
  await db.sequelize.query(`
    INSERT INTO etl_interm_total_claim (claim_id, payment_ref)
    SELECT
      (SELECT claim_id FROM etl_interm_finance_dax WHERE payment_ref = T.payment_ref LIMIT 1) as application_id,
      T.payment_ref
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
  loadIntermTotalClaim
}
