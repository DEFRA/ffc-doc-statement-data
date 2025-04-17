const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const { executeQuery } = require('./load-interm-utils')

const defaultQuery = `
INSERT INTO ${dbConfig.schema}."etlIntermTotal" (
  "paymentRef", "quarter", "totalAmount",
  "transdate", "invoiceid"
)
SELECT DISTINCT "paymentRef", 
  D."quarter",
  SUM("transactionAmount") * -1 as "totalAmount",
  "transdate",
  "invoiceid"
FROM ${dbConfig.schema}."etlIntermFinanceDax" D 
WHERE D."paymentRef" LIKE 'PY%' 
  AND D."etlInsertedDt" > :startDate
GROUP BY "transdate", "quarter", "paymentRef", "invoiceid"
ORDER BY "paymentRef";
`

const delinkedQuery = `
INSERT INTO ${dbConfig.schema}."etlIntermTotal" (
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
FROM ${dbConfig.schema}."etlIntermFinanceDax" D 
JOIN ${dbConfig.schema}."etlStageCalculationDetails" CD ON D."claimId" = CD."applicationId"
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
