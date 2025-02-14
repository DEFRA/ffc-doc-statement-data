const { executeQuery } = require('./load-interm-utils')

const loadIntermTotalClaim = async (startDate, transaction) => {
  const query = `
    INSERT INTO etl_interm_total_claim (claim_id, payment_ref)
    SELECT
      (SELECT claim_id FROM etl_interm_finance_dax WHERE payment_ref = T.payment_ref LIMIT 1) as application_id,
      T.payment_ref
    FROM etl_interm_total T
    WHERE T.etl_inserted_dt > :startDate
    ON CONFLICT (claim_id, payment_ref) DO NOTHING;
  `

  await executeQuery(query, {
    startDate
  }, transaction)
}

module.exports = {
  loadIntermTotalClaim
}
