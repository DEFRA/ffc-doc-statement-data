const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const { executeQuery } = require('./load-interm-utils')

const defaultQuery = `
WITH latest AS (
  SELECT
    D."transdate",
    D."quarter",
    D."claimId",
    D.marketingyear,
    D."transactionAmount",
    D."paymentRef",
    D."invoiceid",
    D."etlInsertedDt",
    ROW_NUMBER() OVER (
      PARTITION BY D."transdate", D."quarter", D."claimId", D.marketingyear, D."paymentRef", D."invoiceid"
      ORDER BY D."etlInsertedDt" DESC
    ) AS rn
  FROM ${dbConfig.schema}."etlIntermFinanceDax" D
),
grouped AS (
  SELECT
    L."transdate",
    L."quarter",
    L."claimId",
    L.marketingyear,
    SUM(L."transactionAmount") AS "totalAmount",
    MAX(L."etlInsertedDt") AS "updatedDt"
  FROM latest L
  WHERE rn = 1
  GROUP BY L."transdate", L."quarter", L."claimId", L.marketingyear
),
ranked AS (
  SELECT
    g."transdate",
    g."quarter",
    g."claimId",
    g.marketingyear,
    g."totalAmount",
    L."paymentRef",
    L."invoiceid",
    CD."calculationId",
    ROW_NUMBER() OVER (
      PARTITION BY g."transdate", g."quarter", g."claimId", g.marketingyear
      ORDER BY
        CASE WHEN L."paymentRef" LIKE 'PY%' THEN 0 ELSE 1 END,
        L."transactionAmount" DESC,
        NULLIF(CAST(RIGHT(L."invoiceid", 1) AS INTEGER), NULL)
    ) AS rn
  FROM grouped g
  JOIN latest L
    ON L."transdate" = g."transdate"
    AND L."quarter" = g."quarter"
    AND L."claimId" = g."claimId"
    AND L.marketingyear = g.marketingyear
    AND L.rn = 1
  INNER JOIN ${dbConfig.schema}."etlStageCalculationDetails" CD
    ON D."claimId" = CD."applicationId"
  WHERE g."updatedDt" > :startDate
)
INSERT INTO ${dbConfig.schema}."etlIntermTotal" (
  "paymentRef", "quarter", "totalAmount",
  "transdate", "invoiceid", "calculationId", marketingyear
)
SELECT
  "paymentRef", 
  "quarter",
  "totalAmount",
  "transdate",
  "invoiceid",
  "calculationId",
  marketingyear
FROM ranked
WHERE rn = 1
  AND "paymentRef" LIKE 'PY%'
  AND "totalAmount" > 0
ORDER BY "paymentRef";
`

const loadIntermTotal = async (startDate, transaction, query = defaultQuery) => {
  await executeQuery(query, {
    startDate
  }, transaction)
}

module.exports = {
  loadIntermTotal
}
