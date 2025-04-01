const { storageConfig } = require('../../config')
const intermFinanceDaxQuery = require('../../constants/interm-finance-dax-query')
const { getEtlStageLogs, executeQuery } = require('./load-interm-utils')
const defaultAccountNumber = 10
const delinkedAccountNumber = 10
const defaultStartOfInvoice = 'S'
const delinkedStartOfInvoice = 'D'
const defaultInvoicePattern = defaultStartOfInvoice + '%Z%'
const delinkedInvoicePattern = delinkedStartOfInvoice + '%Z%'

const loadIntermFinanceDAX = async (startDate, transaction, folder = storageConfig.financeDAX.folder, accountnum = defaultAccountNumber, invoicePattern = defaultInvoicePattern, startOfInvoice = defaultStartOfInvoice) => {
  const etlStageLog = await getEtlStageLogs(startDate, folder)

  if (!etlStageLog[0]) {
    return
  }

  const query = intermFinanceDaxQuery(accountnum, invoicePattern, startOfInvoice)
  const batchSize = storageConfig.etlBatchSize
  const idFrom = etlStageLog[0].idFrom
  const idTo = etlStageLog[0].idTo
  for (let i = idFrom; i <= idTo; i += batchSize) {
    console.log(`Processing financeDAX records ${i} to ${Math.min(i + batchSize - 1, idTo)}`)
    await executeQuery(query, {
      idFrom,
      idTo: Math.min(i + batchSize - 1, idTo)
    }, transaction)
  }
}

const loadIntermFinanceDAXDelinked = async (startDate, transaction) => {
  return loadIntermFinanceDAX(startDate, transaction, storageConfig.financeDAXDelinked.folder, delinkedAccountNumber, delinkedInvoicePattern, delinkedStartOfInvoice)
}

module.exports = {
  loadIntermFinanceDAX,
  loadIntermFinanceDAXDelinked
}
