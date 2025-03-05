const { storageConfig } = require('../../config')
const { getEtlStageLogs, executeQuery } = require('./load-interm-utils')
const defaultAccountNumber = 10
const delinkedAccountNumber = 6
const defaultInvoicePattern = 'S%Z%'
const delinkedInvoicePattern = 'D%Z%'

const loadIntermFinanceDAX = async (startDate, transaction, folder = storageConfig.financeDAX.folder, accountnum = defaultAccountNumber, invoicePattern = defaultInvoicePattern) => {
  const etlStageLog = await getEtlStageLogs(startDate, folder)

  const query = `
WITH new_data AS (
SELECT
  transdate,
  invoiceid,
  COALESCE(NULLIF(scheme, '')::integer, 0) AS scheme,
  fund,
  COALESCE(NULLIF(marketingyear, '')::integer, 0) AS marketingyear,
  "month",
  quarter,
  CAST(
    COALESCE(
      (SELECT CAST((value - lag) / -100.00 AS DECIMAL(10,2)) AS value 
        FROM (
          SELECT
            value,
            COALESCE(LAG(value, 1) OVER ( ORDER BY S.settlement_date ASC),0) AS lag,
            S.reference
            FROM etl_stage_settlement S 
            WHERE S.invoice_number = D.invoiceid
            ORDER BY value
        ) B WHERE B.reference = D.settlementvoucher),
      lineamountmstgbp)
    AS DECIMAL(10,2)) AS TRANSACTION_AMOUNT,
  agreementreference,
  COALESCE(NULLIF(substring(invoiceid, 2, position('Z' in invoiceid) - (position('S' in invoiceid) + 2)), '')::integer, 0) AS siti_invoice_id,
  COALESCE(NULLIF(substring(invoiceid, position('Z' in invoiceid) + 1, position('V' in invoiceid) - (position('Z' in invoiceid) + 1)), '')::integer, 0) AS claim_id,
  settlementvoucher AS PAYMENT_REF,
  change_type,
  recid
FROM etl_stage_finance_dax D
  WHERE LENGTH(accountnum) = ${accountnum}
    AND etl_id BETWEEN :idFrom AND :idTo
    AND invoiceid LIKE '${invoicePattern}'
),
updated_rows AS (
  UPDATE etl_interm_finance_dax interm
  SET
    transdate = new_data.transdate,
    scheme = new_data.scheme,
    fund = new_data.fund,
    marketingyear = new_data.marketingyear,
    "month" = new_data."month",
    quarter = new_data.quarter,
    TRANSACTION_AMOUNT = new_data.TRANSACTION_AMOUNT,
    agreementreference = new_data.agreementreference,
    siti_invoice_id = new_data.siti_invoice_id,
    claim_id = new_data.claim_id,
    invoiceid = new_data.invoiceid,
    etl_inserted_dt = NOW()
  FROM new_data
  WHERE new_data.change_type = 'UPDATE'
    AND interm.recid = new_data.recid
  RETURNING interm.recid
)
INSERT INTO etl_interm_finance_dax (
  transdate,
  invoiceid,
  scheme,
  fund,
  marketingyear,
  "month",
  quarter,
  TRANSACTION_AMOUNT,
  agreementreference,
  siti_invoice_id,
  claim_id,
  PAYMENT_REF,
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
  TRANSACTION_AMOUNT,
  agreementreference,
  siti_invoice_id,
  claim_id,
  PAYMENT_REF,
  recid
FROM new_data
WHERE change_type = 'INSERT'
  OR (change_type = 'UPDATE' AND recid NOT IN (SELECT recid FROM updated_rows));
`

  if (!etlStageLog[0]) {
    return
  }

  const batchSize = storageConfig.etlBatchSize
  const idFrom = etlStageLog[0].id_from
  const idTo = etlStageLog[0].id_to
  for (let i = idFrom; i <= idTo; i += batchSize) {
    console.log(`Processing financeDAX records ${i} to ${Math.min(i + batchSize - 1, idTo)}`)

    console.log('query: ', query)

    await executeQuery(query, {
      idFrom,
      idTo: Math.min(i + batchSize - 1, idTo)
    }, transaction)
  }
}

const loadIntermFinanceDAXDelinked = async (startDate, transaction) => {
  return loadIntermFinanceDAX(startDate, transaction, storageConfig.financeDAXDelinked.folder, delinkedAccountNumber, delinkedInvoicePattern)
}

module.exports = {
  loadIntermFinanceDAX,
  loadIntermFinanceDAXDelinked
}
