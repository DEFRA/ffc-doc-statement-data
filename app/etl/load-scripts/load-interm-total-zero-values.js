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
    D.scheme,
    D.frn,
    D.sbi,
    SUM(D."transactionAmount") AS "totalAmount"
  FROM ${dbConfig.schema}."etlIntermFinanceDax" D
  WHERE D."etlInsertedDt" > :startDate
  GROUP BY D."transdate", D."quarter", D."claimId", D.marketingyear, D.scheme, D.frn, D.sbi
),
ranked AS (
  SELECT
    g."transdate",
    g."quarter",
    g."claimId",
    g.marketingyear,
    g.scheme,
    g.frn,
    g.sbi,
    g."totalAmount",
    D."paymentRef",
    D."invoiceid",
    CD."calculationId",
    ROW_NUMBER() OVER (
      PARTITION BY g."transdate", g."quarter", g."claimId", g.marketingyear, g.scheme, g.frn, g.sbi
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
    AND D.scheme = g.scheme
    AND D.frn = g.frn
    AND D.sbi = g.sbi
    AND D."etlInsertedDt" > :startDate
  INNER JOIN ${dbConfig.schema}."etlStageCalculationDetails" CD
    ON D."claimId" = CD."applicationId"
)
INSERT INTO ${dbConfig.schema}."etlIntermTotalZeroValues" (
  "paymentRef", "quarter", "totalAmount",
  "transdate", "invoiceid", "calculationId", marketingyear, scheme, frn, sbi
)
SELECT
  "paymentRef",
  "quarter",
  "totalAmount",
  "transdate",
  "invoiceid",
  "calculationId",
  marketingyear,
  scheme,
  frn,
  sbi
FROM ranked
WHERE rn = 1
  AND "paymentRef" LIKE 'PY%'
  AND "totalAmount" <= 0
ORDER BY "paymentRef";
`

const delinkedQuery = `
WITH grouped AS (
  SELECT
    D."transdate",
    D."quarter",
    D."claimId",
    D.marketingyear,
    D.scheme,
    D.frn,
    D.sbi,
    SUM(D."transactionAmount") AS "totalAmount"
  FROM ${dbConfig.schema}."etlIntermFinanceDax" D
  WHERE D."etlInsertedDt" > :startDate
  GROUP BY D."transdate", D."quarter", D."claimId", D.marketingyear, D.scheme, D.frn, D.sbi
),
ranked AS (
  SELECT
    g."transdate",
    g."quarter",
    g."claimId",
    g.marketingyear,
    g.scheme,
    g.frn,
    g.sbi,
    g."totalAmount",
    D."paymentRef",
    D."invoiceid",
    CD."calculationId",
    ROW_NUMBER() OVER (
      PARTITION BY g."transdate", g."quarter", g."claimId", g.marketingyear, g.scheme, g.frn, g.sbi
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
    AND D.scheme = g.scheme
    AND D.frn = g.frn
    AND D.sbi = g.sbi
    AND D."etlInsertedDt" > :startDate
  INNER JOIN ${dbConfig.schema}."etlStageCalculationDetails" CD
    ON D."claimId" = CD."applicationId"
)
INSERT INTO ${dbConfig.schema}."etlIntermTotalZeroValues" (
  "paymentRef", "quarter", "totalAmount",
  "transdate", "invoiceid", "calculationId", marketingyear, scheme, frn, sbi
)
SELECT
  "paymentRef",
  "quarter",
  "totalAmount",
  "transdate",
  "invoiceid",
  "calculationId",
  marketingyear,
  scheme,
  frn,
  sbi
FROM ranked
WHERE rn = 1
  AND "paymentRef" LIKE 'PY%'
  AND "totalAmount" <= 0
ORDER BY "paymentRef";
`

const loadIntermTotalZeroValues = async (startDate, transaction, query = defaultQuery) => {
  await executeQuery(query, {
    startDate
  }, transaction)
}

const loadIntermTotalZeroValuesDelinked = async (startDate, transaction) => {
  return loadIntermTotalZeroValues(startDate, transaction, delinkedQuery)
}

module.exports = {
  loadIntermTotalZeroValues,
  loadIntermTotalZeroValuesDelinked
} 