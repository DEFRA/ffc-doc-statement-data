const config = require('../config')
const dbConfig = config.dbConfig[config.env]

const calculateNewDataQuery = (accountnum, invoicePattern, startOfInvoice) => {
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
    CAST(lineamountmstgbp AS DECIMAL(10,2)) * -1 AS "transactionAmount",
    agreementreference,
    CASE
        WHEN substring(invoiceid, 2, position('Z' in invoiceid) - (position('${startOfInvoice}' in invoiceid) + 2)) ~ '^[0-9]+$'
        THEN CAST(substring(invoiceid, 2, position('Z' in invoiceid) - (position('${startOfInvoice}' in invoiceid) + 2)) AS INTEGER)
        ELSE NULL
    END AS "sitiInvoiceId",
    CASE
        WHEN substring(invoiceid, position('Z' in invoiceid) + 1, position('V' in invoiceid) - (position('Z' in invoiceid) + 1)) ~ '^[0-9]+$'
        THEN CAST(substring(invoiceid, position('Z' in invoiceid) + 1, position('V' in invoiceid) - (position('Z' in invoiceid) + 1)) AS INTEGER)
        ELSE NULL
    END AS "claimId",
    CASE
      WHEN settlementvoucher LIKE 'CL%' AND CAST(lineamountmstgbp AS DECIMAL(10,2)) * -1 > 0 THEN
        COALESCE(
          (
            SELECT sv2.settlementvoucher
            FROM ${dbConfig.schema}."etlStageFinanceDax" sv2
            WHERE
              sv2.settlementvoucher LIKE 'PY%'
              AND sv2.quarter = D.quarter
              AND sv2.invoiceid = D.invoiceid
            LIMIT 1
          ),
          settlementvoucher
        )
      ELSE settlementvoucher
    END AS "paymentRef",
    D."changeType",
    recid
FROM ${dbConfig.schema}."etlStageFinanceDax" D
WHERE LENGTH(accountnum) = ${accountnum}
    AND "etlId" BETWEEN :idFrom AND :idTo
    AND "invoiceid" LIKE '${invoicePattern}'
)`
}

module.exports = (accountnum, invoicePattern, startOfInvoice) => {
  return calculateNewDataQuery(accountnum, invoicePattern, startOfInvoice) + `,
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
