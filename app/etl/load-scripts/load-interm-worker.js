const { parentPort, workerData } = require('worker_threads')
const { executeQuery } = require('./load-interm-utils')

const { query, params, transaction } = workerData

async function runQuery () {
  try {
    await executeQuery(query, params, transaction)
    parentPort.postMessage({ success: true })
  } catch (error) {
    parentPort.postMessage({ success: false, error: error.message })
  }
}

runQuery()
