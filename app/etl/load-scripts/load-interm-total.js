const { executeQuery } = require('./load-interm-utils')

const defaultQuery = `
INSERT INTO etl_interm_total (
  payment_ref, quarter, total_amount,
  transdate, invoiceid
)
SELECT DISTINCT payment_ref, 
  D.quarter,
  SUM(transaction_amount) * -1 as total_amount,
  transdate,
  invoiceid
FROM etl_interm_finance_dax D 
WHERE D.payment_ref LIKE 'PY%' 
  AND D.etl_inserted_dt > :startDate
GROUP BY transdate, quarter, payment_ref, invoiceid
ORDER BY payment_ref;
`

const delinkedQuery = `
INSERT INTO etl_interm_total (
  payment_ref, quarter, total_amount,
  transdate, invoiceid
)
SELECT DISTINCT payment_ref, 
  D.quarter,
  SUM(transaction_amount) * -1 as total_amount,
  transdate,
  invoiceid
FROM etl_interm_finance_dax D 
WHERE D.etl_inserted_dt > :startDate
GROUP BY transdate, quarter, payment_ref, invoiceid
ORDER BY payment_ref;
`

const loadIntermTotal = async (startDate, transaction, query = defaultQuery) => {
  await executeQuery(query, {
    startDate
  }, transaction)
}

const loadIntermTotalDelinked = async(startDate, transaction ) => {
  return loadIntermTotal(startDate, transaction, delinkedQuery)
}

module.exports = {
  loadIntermTotal,
  loadIntermTotalDelinked
}
