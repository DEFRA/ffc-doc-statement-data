const config = require('../config')
const dbConfig = config.dbConfig[config.env]

module.exports = `
  WITH newdata AS (
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
      "changeType",
      recid
    FROM ${dbConfig.schema}."etlStageFinanceDax" D
    WHERE LENGTH(accountnum) = 10
      AND "etlId" BETWEEN :idFrom AND :idTo
      AND invoiceid LIKE 'S%Z%'
  ),
  updatedrows AS (
    UPDATE ${dbConfig.schema}."etlIntermFinanceDax" interm
    SET
      transdate = newdata.transdate,
      scheme = newdata.scheme,
      fund = newdata.fund,
      marketingyear = newdata.marketingyear,
      "month" = newdata."month",
      quarter = newdata.quarter,
      "transactionAmount" = newdata."transactionAmount",
      agreementreference = newdata.agreementreference,
      "sitiInvoiceId" = newdata."sitiInvoiceId",
      "claimId" = newdata."claimId",
      invoiceid = newdata.invoiceid,
      "etlInsertedDt" = NOW()
    FROM newdata
    WHERE newdata."changeType" = 'UPDATE'
      AND interm.recid = newdata.recid
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
  FROM newdata
  WHERE "changeType" = 'INSERT'
    OR ("changeType" = 'UPDATE' AND recid NOT IN (SELECT recid FROM updatedrows));
`
