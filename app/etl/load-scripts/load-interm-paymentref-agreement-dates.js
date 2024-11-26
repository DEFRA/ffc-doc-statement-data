const db = require('../../data')

const loadIntermPaymentrefAgreementDates = async (startDate, transaction) => {
  await db.sequelize.query(`
    INSERT INTO etl_interm_paymentref_agreement_dates (
      payment_ref, agreementStart, agreementEnd
    )
    SELECT
      DA.payment_ref,
      MIN(IAC.agreementStart) AS agreementStart,
      MAX(IAC.agreementEnd) AS agreementEnd
    FROM etl_interm_finance_dax DA
    INNER JOIN etl_stage_css_contract_applications CA ON CA.application_id = DA.claim_id
    INNER JOIN etl_interm_application_contract IAC ON IAC.contract_id = CA.contract_id
    WHERE DA.etl_inserted_dt > :startDate
    GROUP BY DA.payment_ref
    HAVING MIN(IAC.agreementStart) IS NOT NULL AND MAX(IAC.agreementEnd) IS NOT NULL;
  `, {
    replacements: {
      startDate
    },
    raw: true,
    transaction
  })
}

module.exports = {
  loadIntermPaymentrefAgreementDates
}
