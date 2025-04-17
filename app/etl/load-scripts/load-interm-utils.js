const db = require('../../data')

const { Worker } = require('worker_threads')
const path = require('path')

const MAX_WORKERS = 10 // Set the maximum number of workers

const getEtlStageLogs = async (startDate, folder) => {
  const folders = Array.isArray(folder) ? folder : [folder]

  const logsByFolder = await Promise.all(
    folders.map(async (f) => {
      const logs = await db.etlStageLog.findAll({
        where: {
          file: `${f}/export.csv`,
          endedAt: {
            [db.Sequelize.Op.gt]: startDate
          }
        }
      })

      if (logs.length > 1) {
        throw new Error(`Multiple records found for updates to ${f}, expected only one`)
      }
      return logs.length === 0 ? null : logs[0]
    })
  )

  return logsByFolder.filter(log => log !== null)
}

const executeQuery = async (query, replacements, transaction) => {
  await db.sequelize.query(query, {
    replacements,
    raw: true,
    transaction
  })
}

const limitConcurrency = async (promises, maxConcurrent) => {
  const results = []
  const executing = []

  for (const promise of promises) {
    const p = promise().then(result => {
      executing.splice(executing.indexOf(p), 1)
      return result
    })
    results.push(p)
    executing.push(p)

    if (executing.length >= maxConcurrent) {
      await Promise.race(executing)
    }
  }

  return Promise.all(results)
}

const processWithWorkers = async (query, batchSize, idFrom, idTo, transaction, recordType, queryTemplate = null, exclusionScript = null, tableAlias = null) => {
  const workers = []
  const workerPromises = []
  let activeWorkers = 0

  for (let i = idFrom; i <= idTo; i += batchSize) {
    /* eslint-disable no-unmodified-loop-condition */
    while (activeWorkers >= MAX_WORKERS) {
      await new Promise(resolve => setTimeout(resolve, 100)) // Wait for a worker to become available
    }
    const batchTo = Math.min(i + batchSize - 1, idTo)
    console.log(`Processing ${recordType} records ${i} to ${batchTo}`)
    const workerData = {
      query,
      params: {
        idFrom: i,
        idTo: batchTo
      },
      transaction
    }
    if (queryTemplate && exclusionScript !== null && tableAlias) {
      // Build query per batch
      workerData.query = queryTemplate(i, batchTo, tableAlias, exclusionScript)
      workerData.params = {}
    }

    const worker = new Worker(path.resolve(__dirname, 'load-interm-worker.js'), {
      workerData
    })

    activeWorkers++
    workers.push(worker)

    workerPromises.push(new Promise((resolve, reject) => {
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
    }))

    worker.on('exit', () => {
      activeWorkers--
    })
  }

  await Promise.all(workerPromises)
}

module.exports = {
  getEtlStageLogs,
  executeQuery,
  limitConcurrency,
  processWithWorkers
}
