const { etlConfig } = require('../../config')
const intermFinanceDaxQuery = require('../../constants/interm-finance-dax-query')
const { getEtlStageLogs } = require('./load-interm-utils')
const defaultAccountNumber = 10
const delinkedAccountNumber = 10
const defaultStartOfInvoice = 'S'
const delinkedStartOfInvoice = 'D'
const defaultInvoicePattern = defaultStartOfInvoice + '%Z%'
const delinkedInvoicePattern = delinkedStartOfInvoice + '%Z%'

const { Worker } = require('worker_threads')
const path = require('path')

const MAX_WORKERS = 5

const loadIntermFinanceDAX = async (startDate, transaction, folder = etlConfig.financeDAX.folder, accountnum = defaultAccountNumber, invoicePattern = defaultInvoicePattern, startOfInvoice = defaultStartOfInvoice) => {
  const etlStageLog = await getEtlStageLogs(startDate, folder)

  if (!etlStageLog[0]) {
    return
  }

  const query = intermFinanceDaxQuery(accountnum, invoicePattern, startOfInvoice)
  const batchSize = etlConfig.etlBatchSize
  const idFrom = etlStageLog[0].idFrom
  const idTo = etlStageLog[0].idTo

  const workers = []
  let activeWorkers = 0

  for (let i = idFrom; i <= idTo; i += batchSize) {
    /* eslint-disable no-unmodified-loop-condition */
    while (activeWorkers >= MAX_WORKERS) {
      // Wait for an available worker
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log(`Processing financeDAX records ${i} to ${Math.min(i + batchSize - 1, idTo)}`)

    const worker = new Worker(path.resolve(__dirname, 'load-interm-worker.js'), {
      workerData: {
        query,
        params: {
          idFrom: i,
          idTo: Math.min(i + batchSize - 1, idTo)
        },
        transaction
      }
    })

    activeWorkers++
    workers.push(worker)

    worker.on('exit', () => {
      activeWorkers--
    })
  }

  await Promise.all(workers.map(worker => new Promise((resolve, reject) => {
    worker.on('message', (message) => {
      if (message.success) {
        resolve()
      } else {
        reject(new Error(message.error))
      }
    })
    worker.on('error', reject)
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`))
      }
    })
  })))
}

const loadIntermFinanceDAXDelinked = async (startDate, transaction) => {
  return loadIntermFinanceDAX(startDate, transaction, etlConfig.financeDAXDelinked.folder, delinkedAccountNumber, delinkedInvoicePattern, delinkedStartOfInvoice)
}

module.exports = {
  loadIntermFinanceDAX,
  loadIntermFinanceDAXDelinked
}
