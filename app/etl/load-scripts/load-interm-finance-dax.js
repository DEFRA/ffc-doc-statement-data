const { etlConfig } = require('../../config')
const intermFinanceDaxQuery = require('../../constants/interm-finance-dax-query')
const { getEtlStageLogs, processWithWorkers } = require('./load-interm-utils')

const delinkedAccountNumber = 10
const delinkedStartOfInvoice = 'D'
const delinkedInvoicePattern = delinkedStartOfInvoice + '%Z%'

const loadIntermFinanceDAX = async (startDate, transaction) => {
  const etlStageLog = await getEtlStageLogs(startDate, etlConfig.financeDAXDelinked.folder)

  if (!etlStageLog[0]) {
    return
  }

  const query = intermFinanceDaxQuery(delinkedAccountNumber, delinkedInvoicePattern, delinkedStartOfInvoice)
  const batchSize = etlConfig.etlBatchSize
  const idFrom = etlStageLog[0].idFrom
  const idTo = etlStageLog[0].idTo

  await processWithWorkers({ query, batchSize, idFrom, idTo, transaction, recordType: 'financeDAX' })
}

module.exports = {
  loadIntermFinanceDAX
}
