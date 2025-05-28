const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const { executeQuery } = require('./load-interm-utils')

const defaultQuery = `
WITH grouped AS (
  SELECT
    D."transdate",
    D."quarter",
    D."claimId",
    SUM(D."transactionAmount") AS "totalAmount"
  FROM ${dbConfig.schema}."etlIntermFinanceDax" D
  WHERE D."etlInsertedDt" > :startDate
  GROUP BY D."transdate", D."quarter", D."claimId"
),
ranked AS (
  SELECT
    g."transdate",
    g."quarter",
    g."claimId",
    g."totalAmount",
    D."paymentRef",
    D."invoiceid",
    ROW_NUMBER() OVER (
      PARTITION BY g."transdate", g."quarter", g."claimId"
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
    AND D."etlInsertedDt" > :startDate
)
INSERT INTO ${dbConfig.schema}."etlIntermTotal" (
  "paymentRef", "quarter", "totalAmount",
  "transdate", "invoiceid"
)
SELECT
  "paymentRef", 
  "quarter",
  "totalAmount",
  "transdate",
  "invoiceid"
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
    CD."calculationId",
    SUM(D."transactionAmount") AS "totalAmount"
  FROM ${dbConfig.schema}."etlIntermFinanceDax" D
  JOIN ${dbConfig.schema}."etlStageCalculationDetails" CD
    ON D."claimId" = CD."applicationId"
  WHERE D."etlInsertedDt" > :startDate
  GROUP BY D."transdate", D."quarter", D."claimId", D.marketingyear, CD."calculationId"
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
    g."calculationId",
    ROW_NUMBER() OVER (
      PARTITION BY g."transdate", g."quarter", g."claimId", g."calculationId"
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
  JOIN ${dbConfig.schema}."etlStageCalculationDetails" CD
    ON D."claimId" = CD."applicationId"
    AND CD."calculationId" = g."calculationId"
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
  console.log('load totals into interm total')
  return loadIntermTotal(startDate, transaction, delinkedQuery)
}

module.exports = {
  loadIntermTotal,
  loadIntermTotalDelinked
}
