const { etlConfig } = require('../../config')
const intermFinanceDaxQuery = require('../../constants/interm-finance-dax-query')
const { getEtlStageLogs, processWithWorkers } = require('./load-interm-utils')
const defaultAccountNumber = 10
const delinkedAccountNumber = 10
const defaultStartOfInvoice = 'S'
const delinkedStartOfInvoice = 'D'
const defaultInvoicePattern = defaultStartOfInvoice + '%Z%V%'
const delinkedInvoicePattern = delinkedStartOfInvoice + '%Z%'

const loadIntermFinanceDAX = async (startDate, transaction, folder = etlConfig.financeDAX.folder, accountnum = defaultAccountNumber, invoicePattern = defaultInvoicePattern, startOfInvoice = defaultStartOfInvoice) => {
  const etlStageLog = await getEtlStageLogs(startDate, folder)

  if (!etlStageLog[0]) {
    return
  }

  const query = intermFinanceDaxQuery(accountnum, invoicePattern, startOfInvoice)
  const batchSize = etlConfig.etlBatchSize
  const idFrom = etlStageLog[0].idFrom
  const idTo = etlStageLog[0].idTo

  await processWithWorkers({ query, batchSize, idFrom, idTo, transaction, recordType: 'financeDAX' })
}

const loadIntermFinanceDAXDelinked = async (startDate, transaction) => {
  return loadIntermFinanceDAX(startDate, transaction, etlConfig.financeDAXDelinked.folder, delinkedAccountNumber, delinkedInvoicePattern, delinkedStartOfInvoice)
}

module.exports = {
  loadIntermFinanceDAX,
  loadIntermFinanceDAXDelinked
}
