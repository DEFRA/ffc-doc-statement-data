const os = require('os')
const db = require('../../data')

const { Worker } = require('worker_threads')
const path = require('path')

const numCPUs = os.cpus().length
const MAX_WORKERS = numCPUs === 2 ? 1 : numCPUs - 2 // Set the maximum number of workers

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
  const workerPromises = []
  const activeWorkers = new Set()
  // Synchronise control
  const semaphore = {
    count: 0,
    queue: [],
    async acquire () {
      if (this.count < MAX_WORKERS) {
        this.count++
        return Promise.resolve()
      }
      return new Promise(resolve => this.queue.push(resolve))
    },
    release () {
      this.count--
      if (this.queue.length > 0) {
        this.count++
        const next = this.queue.shift()
        next()
      }
    }
  }

  for (let i = idFrom; i <= idTo; i += batchSize) {
    const batchTo = Math.min(i + batchSize - 1, idTo)

    // Wait if we have reached max workers
    await semaphore.acquire()

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

    const workerPromise = new Promise((resolve, reject) => {
      worker.on('message', (message) => {
        if (message.success) {
          resolve()
        } else {
          reject(new Error(`Batch ${i}-${batchTo} failed: ${message.error}`))
        }
      })

      worker.on('error', (error) => {
        reject(new Error(`Batch ${i}-${batchTo} failed with error: ${error.message}`))
      })

      worker.on('exit', (code) => {
        activeWorkers.delete(workerPromise)
        worker.terminate().catch(console.error)
        semaphore.release()
        if (code !== 0) {
          reject(new Error(`Batch ${i}-${batchTo}: Worker stopped with exit code ${code}`))
        }
      })
    })

    activeWorkers.add(workerPromise)
    workerPromises.push(workerPromise)
  }

  try {
    await Promise.all(workerPromises)
  } catch (error) {
    console.error('Worker processing failed:', error)
    throw error
  }
}

module.exports = {
  getEtlStageLogs,
  executeQuery,
  limitConcurrency,
  processWithWorkers
}
