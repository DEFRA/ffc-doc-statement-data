const config = require('../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (accountnum, invoicePattern) => {
  return `
WITH "newData" AS (
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
                COALESCE(LAG(value, 1) OVER (ORDER BY S."settlementDate" ASC, S.value ASC),0) AS lag,
                S.reference
                FROM ${dbConfig.schema}."etlStageSettlement" S 
                WHERE S."invoiceNumber" = D.invoiceid
                ORDER BY value
            ) B WHERE B.reference = D.settlementvoucher),
          lineamountmstgbp)
        AS DECIMAL(10,2)) AS "transactionAmount",
      agreementreference,
      substring(invoiceid, 2, position('Z' in invoiceid) - (position('S' in invoiceid) + 2))::integer AS "sitiInvoiceId",
      substring(invoiceid, position('Z' in invoiceid) + 1, position('V' in invoiceid) - (position('Z' in invoiceid) + 1))::integer AS "claimId",
      settlementvoucher AS "paymentRef",
      D."changeType",
      recid
    FROM ${dbConfig.schema}."etlStageFinanceDax" D
    WHERE LENGTH(accountnum) = ${accountnum}
      AND "etlId" BETWEEN :idFrom AND :idTo
      AND "invoiceid" LIKE '${invoicePattern}'
  ),
  "updatedRows" AS (
    UPDATE ${dbConfig.schema}."etlIntermFinanceDax" interm
    SET
      transdate = "newData".transdate,
      scheme = "newData".scheme,
      fund = "newData".fund,
      marketingyear = "newData".marketingyear,
      "month" = "newData"."month",
      quarter = "newData".quarter,
      "transactionAmount" = "newData"."transactionAmount",
      agreementreference = "newData".agreementreference,
      "sitiInvoiceId" = "newData"."sitiInvoiceId",
      "claimId" = "newData"."claimId",
      invoiceid = "newData".invoiceid,
      "etlInsertedDt" = NOW()
    FROM "newData"
    WHERE "newData"."changeType" = 'UPDATE'
      AND interm.recid = "newData".recid
    RETURNING interm.recid
  )
  INSERT INTO ${dbConfig.schema}."etlIntermFinanceDax" (
    transdate,
    invoiceid,
    scheme,
    fund,
    marketingyear,
    "month",
    quarter,
    "transactionAmount",
    agreementreference,
    "sitiInvoiceId",
    "claimId",
    "paymentRef",
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
    "transactionAmount",
    agreementreference,
    "sitiInvoiceId",
    "claimId",
    "paymentRef",
    recid
  FROM "newData"
  WHERE "newData"."changeType" = 'INSERT'
    OR ("newData"."changeType" = 'UPDATE' AND recid NOT IN (SELECT recid FROM "updatedRows"));
`
}
