const { storageConfig } = require('../../config')
const db = require('../../data')

const loadIntermFinanceDAX = async (startDate, transaction) => {
  const etlStageLogs = await db.etlStageLog.findAll({
    where: {
      file: `${storageConfig.financeDAX.folder}/export.csv`,
      ended_at: {
        [db.Sequelize.Op.gt]: startDate
      }
    }
  })

  if (etlStageLogs.length > 1) {
    throw new Error(`Multiple records found for updates to ${storageConfig.financeDAX.folder}, expected only one`)
  } else if (etlStageLogs.length === 0) {
    return
  }

  await db.sequelize.query(`
    WITH new_data AS (
      SELECT
        transdate,
        invoiceid,
        scheme::integer,
        fund,
        marketingyear::integer,
        "month",
        quarter,
        lineamountmstgbp AS TRANSACTION_AMOUNT,
        agreementreference,
        substring(invoiceid, 2, position('Z' in invoiceid) - (position('S' in invoiceid) + 2))::integer AS siti_invoice_id,
        substring(invoiceid, position('Z' in invoiceid) + 1, position('V' in invoiceid) - (position('Z' in invoiceid) + 1))::integer AS claim_id,
        settlementvoucher AS PAYMENT_REF,
        change_type,
        recid
      FROM etl_stage_finance_dax
      WHERE LENGTH(accountnum) = 10
        AND etl_id BETWEEN :idFrom AND :idTo
        AND invoiceid LIKE 'S%Z%'
    ),
    updated_rows AS (
      UPDATE etl_interm_finance_dax interm
      SET
        transdate = new_data.transdate,
        scheme = new_data.scheme,
        fund = new_data.fund,
        marketingyear = new_data.marketingyear,
        "month" = new_data."month",
        quarter = new_data.quarter,
        TRANSACTION_AMOUNT = new_data.TRANSACTION_AMOUNT,
        agreementreference = new_data.agreementreference,
        siti_invoice_id = new_data.siti_invoice_id,
        claim_id = new_data.claim_id,
        invoiceid = new_data.invoiceid,
        etl_inserted_dt = NOW()
      FROM new_data
      WHERE new_data.change_type = 'UPDATE'
        AND interm.recid = new_data.recid
      RETURNING interm.recid
    )
    INSERT INTO etl_interm_finance_dax (
      transdate,
      invoiceid,
      scheme,
      fund,
      marketingyear,
      "month",
      quarter,
      TRANSACTION_AMOUNT,
      agreementreference,
      siti_invoice_id,
      claim_id,
      PAYMENT_REF,
      recid
    )
    SELECT
      transdate,
      invoiceid,
      scheme,
      fund,
      marketingyear,
      "month",
      quarter,
      TRANSACTION_AMOUNT,
      agreementreference,
      siti_invoice_id,
      claim_id,
      PAYMENT_REF,
      recid
    FROM new_data
    WHERE change_type = 'INSERT'
      OR (change_type = 'UPDATE' AND recid NOT IN (SELECT recid FROM updated_rows));
  `, {
    replacements: {
      idFrom: etlStageLogs[0].id_from,
      idTo: etlStageLogs[0].id_to
    },
    raw: true,
    transaction
  })
}

module.exports = {
  loadIntermFinanceDAX
}
