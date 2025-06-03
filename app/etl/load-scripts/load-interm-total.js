const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const { executeQuery } = require('./load-interm-utils')

const defaultQuery = `
WITH grouped AS (
  SELECT
    D."transdate",
    D."quarter",
    D."claimId",
    D.marketingyear,
    SUM(D."transactionAmount") AS "totalAmount"
  FROM ${dbConfig.schema}."etlIntermFinanceDax" D
  WHERE D."etlInsertedDt" > :startDate
  GROUP BY D."transdate", D."quarter", D."claimId", D.marketingyear
),
ranked AS (
  SELECT
    g."transdate",
    g."quarter",
    g."claimId",
    g.marketingyear,
    g."totalAmount",
    D."paymentRef",
    D."invoiceid",
    CD."calculationId",
    ROW_NUMBER() OVER (
      PARTITION BY g."transdate", g."quarter", g."claimId", g.marketingyear
      ORDER BY
        CASE WHEN D."paymentRef" LIKE 'PY%' THEN 0 ELSE 1 END,
        D."transactionAmount" DESC,
        NULLIF(CAST(RIGHT(D."invoiceid", 1) AS INTEGER), NULL)
    ) AS rn
  FROM grouped g
  JOIN ${dbConfig.schema}."etlIntermFinanceDax" D
    ON D."transdate" = g."transdate"
    AND D."quarter" = g."quarter"
    AND D."claimId" = g."claimId"
    AND D.marketingyear = g.marketingyear
    AND D."etlInsertedDt" > :startDate
  INNER JOIN ${dbConfig.schema}."etlStageCalculationDetails" CD
    ON D."claimId" = CD."applicationId"
)
INSERT INTO ${dbConfig.schema}."etlIntermTotal" (
  "paymentRef", "quarter", "totalAmount",
  "transdate", "invoiceid", marketingyear
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
ORDER BY "paymentRef";
`

const delinkedQuery = `
WITH grouped AS (
  SELECT
    D."transdate",
    D."quarter",
    D."claimId",
    D.marketingyear,
    SUM(D."transactionAmount") AS "totalAmount"
  FROM ${dbConfig.schema}."etlIntermFinanceDax" D
  WHERE D."etlInsertedDt" > :startDate
  GROUP BY D."transdate", D."quarter", D."claimId", D.marketingyear
),
ranked AS (
  SELECT
    g."transdate",
    g."quarter",
    g."claimId",
    g.marketingyear,
    g."totalAmount",
    D."paymentRef",
    D."invoiceid",
    CD."calculationId",
    ROW_NUMBER() OVER (
      PARTITION BY g."transdate", g."quarter", g."claimId", g.marketingyear
      ORDER BY
        CASE WHEN D."paymentRef" LIKE 'PY%' THEN 0 ELSE 1 END,
        D."transactionAmount" DESC,
        NULLIF(CAST(RIGHT(D."invoiceid", 1) AS INTEGER), NULL)
    ) AS rn
  FROM grouped g
  JOIN ${dbConfig.schema}."etlIntermFinanceDax" D
    ON D."transdate" = g."transdate"
    AND D."quarter" = g."quarter"
    AND D."claimId" = g."claimId"
    AND D.marketingyear = g.marketingyear    
    AND D."etlInsertedDt" > :startDate
  INNER JOIN ${dbConfig.schema}."etlStageCalculationDetails" CD
    ON D."claimId" = CD."applicationId"
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
ORDER BY "paymentRef";
`

const loadIntermTotal = async (startDate, transaction, query = defaultQuery) => {
  await executeQuery(query, {
    startDate
  }, transaction)
}

const loadIntermTotalDelinked = async (startDate, transaction) => {
  return loadIntermTotal(startDate, transaction, delinkedQuery)
}

module.exports = {
  loadIntermTotal,
  loadIntermTotalDelinked
}
