const db = require('../../data')

const loadIntermPaymentrefApplication = async (startDate, transaction) => {
  await db.sequelize.query(`
    INSERT INTO etl_interm_paymentref_application(payment_ref, application_id)
    SELECT
      T.payment_ref,
      (SELECT claim_id AS application_id FROM etl_interm_finance_dax D WHERE D.payment_ref = T.payment_ref LIMIT 1)
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
  loadIntermPaymentrefApplication
}
