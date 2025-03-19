const { executeQuery } = require('./load-interm-utils')

const defaultQuery = `
INSERT INTO "etlIntermTotal" (
  "paymentRef", "quarter", "totalAmount",
  "transdate", "invoiceid"
)
SELECT DISTINCT "paymentRef", 
  D."quarter",
  SUM("transactionAmount") * -1 as "totalAmount",
  "transdate",
  "invoiceid"
FROM "etlIntermFinanceDax" D 
WHERE D."paymentRef" LIKE 'PY%' 
  AND D."etlInsertedDt" > :startDate
GROUP BY "transdate", "quarter", "paymentRef", "invoiceid"
ORDER BY "paymentRef";
`

const delinkedQuery = `
INSERT INTO "etlIntermTotal" (
  "paymentRef", "quarter", "totalAmount",
  "transdate", "invoiceid", "calculationId"
)
SELECT DISTINCT 
  D."paymentRef", 
  D."quarter",
  SUM(D."transactionAmount") * -1 as "totalAmount",
  D."transdate",
  D."invoiceid",
  CD."calculationId"
FROM "etlIntermFinanceDax" D
JOIN "etlStageCalculationDetails" CD ON D."claimId" = CD."applicationId"
WHERE D."paymentRef" LIKE 'PY%'
    AND D."etlInsertedDt" > :startDate
GROUP BY 
  D."transdate", 
  D."quarter", 
  D."paymentRef", 
  D."invoiceid", 
  CD."calculationId"
ORDER BY D."paymentRef";
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