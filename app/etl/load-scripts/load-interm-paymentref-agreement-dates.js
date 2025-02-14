const { executeQuery } = require('./load-interm-utils')

const loadIntermPaymentrefAgreementDates = async (startDate, transaction) => {
  const query = `
    INSERT INTO etl_interm_paymentref_agreement_dates (
      payment_ref, agreementStart, agreementEnd
    )
    SELECT
      DA.payment_ref,
      (SELECT agreementStart FROM etl_interm_application_contract IAC WHERE IAC.contract_id = CA.contract_id LIMIT 1),
      (SELECT agreementEnd FROM etl_interm_application_contract IAC WHERE IAC.contract_id = CA.contract_id LIMIT 1)
    FROM etl_interm_finance_dax DA
    INNER JOIN etl_stage_css_contract_applications CA ON CA.application_id = DA.claim_id
    INNER JOIN etl_interm_application_contract IAC ON IAC.contract_id = CA.contract_id
    WHERE IAC.agreementStart IS NOT NULL
      AND IAC.agreementEnd IS NOT NULL
      AND (
        DA.etl_inserted_dt > :startDate
        OR CA.etl_inserted_dt > :startDate
        OR IAC.etl_inserted_dt > :startDate
      )
    GROUP BY DA.payment_ref, CA.contract_id
    ON CONFLICT (payment_ref, agreementStart, agreementEnd) DO NOTHING;
  `

  await executeQuery(query, {
    startDate
  }, transaction)
}

module.exports = {
  loadIntermPaymentrefAgreementDates
}
