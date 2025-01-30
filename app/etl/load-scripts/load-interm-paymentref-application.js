const { executeQuery } = require('./load-interm-utils')

const loadIntermPaymentrefApplication = async (startDate, transaction) => {
  const query = `
    INSERT INTO etl_interm_paymentref_application(payment_ref, application_id)
    SELECT
      T.payment_ref,
      (SELECT claim_id AS application_id FROM etl_interm_finance_dax D WHERE D.payment_ref = T.payment_ref LIMIT 1)
    FROM etl_interm_total T
    WHERE T.etl_inserted_dt > :startDate
    ON CONFLICT (payment_ref, application_id) DO NOTHING;
  `

  await executeQuery(query, {
    startDate
  }, transaction)
}

module.exports = {
  loadIntermPaymentrefApplication
}
