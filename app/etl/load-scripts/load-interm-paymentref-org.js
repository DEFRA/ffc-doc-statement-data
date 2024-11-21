const db = require('../../data')

const loadIntermPaymentrefOrg = async (startDate, transaction) => {
  await db.sequelize.query(`
    INSERT INTO etl_interm_paymentref_org (payment_ref, sbi, frn)
    SELECT PA.payment_ref, O.sbi, O.frn::bigint 
      FROM etl_interm_paymentref_application PA 
    INNER JOIN etl_interm_calc_org O ON O.application_id = PA.application_id
    WHERE PA.etl_inserted_dt > :startDate
    GROUP BY PA.payment_ref, O.sbi, O.frn;
  `, {
    replacements: {
      startDate
    },
    raw: true,
    transaction
  })
}

module.exports = {
  loadIntermPaymentrefOrg
}
