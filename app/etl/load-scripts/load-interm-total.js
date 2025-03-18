const { executeQuery } = require('./load-interm-utils')

const defaultQuery = `
INSERT INTO etlIntermTotal (
  paymentRef, quarter, totalAmount,
  transdate, invoiceid
)
SELECT DISTINCT paymentRef, 
  D.quarter,
  SUM(transactionAmount) * -1 as totalAmount,
  transdate,
  invoiceid
FROM etlIntermFinanceDax D 
WHERE D.paymentRef LIKE 'PY%' 
  AND D.etlInsertedDt > :startDate
GROUP BY transdate, quarter, paymentRef, invoiceid
ORDER BY paymentRef;
`

const delinkedQuery = `
INSERT INTO etl_interm_total (
  payment_ref, quarter, total_amount,
  transdate, invoiceid, calculation_id
)
SELECT DISTINCT 
  D.payment_ref, 
  D.quarter,
  SUM(D.transaction_amount) * -1 as total_amount,
  D.transdate,
  D.invoiceid,
  CD.calculation_id
FROM etl_interm_finance_dax D
JOIN etl_stage_calculation_details CD ON D.claim_id = CD.application_id
WHERE D.payment_ref LIKE 'PY%'
    AND D.etl_inserted_dt > :startDate
GROUP BY 
  D.transdate, 
  D.quarter, 
  D.payment_ref, 
  D.invoiceid, 
  CD.calculation_id
ORDER BY D.payment_ref;
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
