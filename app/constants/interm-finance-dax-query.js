module.exports = (accountnum, invoicePattern) => {
  return `
WITH new_data AS (
    SELECT
      transdate,
      invoiceid,
      scheme::integer,
      fund,
      marketingyear::integer,
      "month",
      quarter,
      CAST(
        COALESCE(
          (SELECT CAST((value - lag) / -100.00 AS DECIMAL(10,2)) AS value 
            FROM (
              SELECT
                value,
                COALESCE(LAG(value, 1) OVER (ORDER BY S.settlement_date ASC, S.value ASC),0) AS lag,
                S.reference
                FROM etl_stage_settlement S 
                WHERE S.invoice_number = D.invoiceid
                ORDER BY value
            ) B WHERE B.reference = D.settlementvoucher),
          lineamountmstgbp)
        AS DECIMAL(10,2)) AS TRANSACTION_AMOUNT,
      agreementreference,
      substring(invoiceid, 2, position('Z' in invoiceid) - (position('S' in invoiceid) + 2))::integer AS siti_invoice_id,
      substring(invoiceid, position('Z' in invoiceid) + 1, position('V' in invoiceid) - (position('Z' in invoiceid) + 1))::integer AS claim_id,
      settlementvoucher AS PAYMENT_REF,
      change_type,
      recid
    FROM etl_stage_finance_dax D
    WHERE LENGTH(accountnum) = ${accountnum}
      AND etl_id BETWEEN :idFrom AND :idTo
      AND invoiceid LIKE '${invoicePattern}'
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
`
}
