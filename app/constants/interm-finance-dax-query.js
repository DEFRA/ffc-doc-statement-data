module.exports = (accountnum, invoicePattern) => {
  return `
WITH newData AS (
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
                COALESCE(LAG(value, 1) OVER (ORDER BY S.settlementDate ASC, S.value ASC),0) AS lag,
                S.reference
                FROM etlStageSettlement S 
                WHERE S.invoiceNumber = D.invoiceid
                ORDER BY value
            ) B WHERE B.reference = D.settlementvoucher),
          lineamountmstgbp)
        AS DECIMAL(10,2)) AS TRANSACTIONAMOUNT,
      agreementreference,
      substring(invoiceid, 2, position('Z' in invoiceid) - (position('S' in invoiceid) + 2))::integer AS sitiInvoiceId,
      substring(invoiceid, position('Z' in invoiceid) + 1, position('V' in invoiceid) - (position('Z' in invoiceid) + 1))::integer AS claimId,
      settlementvoucher AS PAYMENTREF,
      changeType,
      recid
    FROM etlStageFinanceDax D
    WHERE LENGTH(accountnum) = ${accountnum}
      AND etlId BETWEEN :idFrom AND :idTo
      AND invoiceid LIKE '${invoicePattern}'
  ),
  updatedRows AS (
    UPDATE etlIntermFinanceDax interm
    SET
      transdate = newData.transdate,
      scheme = newData.scheme,
      fund = newData.fund,
      marketingyear = newData.marketingyear,
      "month" = newData."month",
      quarter = newData.quarter,
      TRANSACTIONAMOUNT = newData.TRANSACTIONAMOUNT,
      agreementreference = newData.agreementreference,
      sitiInvoiceId = newData.sitiInvoiceId,
      claimId = newData.claimId,
      invoiceid = newData.invoiceid,
      etlInsertedDt = NOW()
    FROM newData
    WHERE newData.changeType = 'UPDATE'
      AND interm.recid = newData.recid
    RETURNING interm.recid
  )
  INSERT INTO etlIntermFinanceDax (
    transdate,
    invoiceid,
    scheme,
    fund,
    marketingyear,
    "month",
    quarter,
    TRANSACTIONAMOUNT,
    agreementreference,
    sitiInvoiceId,
    claimId,
    PAYMENTREF,
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
    TRANSACTIONAMOUNT,
    agreementreference,
    sitiInvoiceId,
    claimId,
    PAYMENTREF,
    recid
  FROM newData
  WHERE changeType = 'INSERT'
    OR (changeType = 'UPDATE' AND recid NOT IN (SELECT recid FROM updatedRows));
`
}
