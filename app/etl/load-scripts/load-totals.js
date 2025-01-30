const { executeQuery } = require('./load-interm-utils')

const loadTotals = async (startDate, transaction) => {
  const query = `
    INSERT INTO totals (
      "calculationId", "sbi", "frn", "agreementNumber",
      "claimId", "schemeType", "calculationDate",
      "invoiceNumber", "agreementStart", "agreementEnd",
      "totalAdditionalPayments", "totalActionPayments", "updated",
      "datePublished", "totalPayments"  
    )
    SELECT
      T.calculation_id AS calculationId,
      PO.sbi::integer,
      PO.frn::integer,
      CA2.application_id AS agreementNumber,
      PA.application_id AS claimId,
      'SFI-23' AS schemeType,
      NOW() AS calculationDate,
      'N/A' AS invoiceNumber,
      IPAD.agreementStart,
      IPAD.agreementEnd,
      T.total_amount AS totalAdditionalPayments,
      T.total_amount AS totalActionPayments,
      NOW() as updated,
      NULL as datePublished,
      T.total_amount AS totalPayments
    FROM etl_interm_total T
    INNER JOIN etl_interm_paymentref_org PO ON PO.payment_ref = T.payment_ref
    INNER JOIN etl_interm_paymentref_application PA ON PA.payment_ref = T.payment_ref
    INNER JOIN etl_stage_css_contract_applications CA ON CA.application_id = PA.application_id AND CA.data_source_s_code = 'CAPCLM'
    INNER JOIN etl_stage_css_contract_applications CA2 ON CA.contract_id = CA2.contract_id AND CA2.data_source_s_code = '000001'
    INNER JOIN etl_interm_paymentref_agreement_dates IPAD ON IPAD.payment_ref = T.payment_ref
    WHERE T.etl_inserted_dt > :startDate
    ON CONFLICT ("calculationId") DO NOTHING;
  `

  await executeQuery(query, {
    startDate
  }, transaction)
}

module.exports = {
  loadTotals
}
