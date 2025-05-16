const os = require('os')
const db = require('../../data')

const { Worker } = require('worker_threads')
const path = require('path')

const numCPUs = os.cpus().length
// 2 workers to each CPU (with some spare CPUs for redunancy) because I/O task
const MAX_WORKERS = 2 * (numCPUs === 2 ? 1 : numCPUs - 2) // Set the maximum number of workers

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

const acquireSemaphore = async (semaphore) => {
  await semaphore.acquire()
}

const releaseSemaphore = (semaphore) => {
  semaphore.release()
}

const runWorker = (workerData, i, batchTo, semaphore) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, 'load-interm-worker.js'), {
      workerData
    })

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
      worker.terminate().catch(console.error)
      releaseSemaphore(semaphore)
      if (code !== 0) {
        reject(new Error(`Batch ${i}-${batchTo}: Worker stopped with exit code ${code}`))
      }
    })
  })
}

const processBatchWithRetries = async (options, i, batchTo, semaphore, maxRetries, baseDelay) => {
  const { query, transaction, recordType, queryTemplate = null, exclusionScript = null, tableAlias = null } = options
  let attempt = 0
  let success = false

  while (attempt <= maxRetries && !success) {
    try {
      let workerData = {
        query,
        params: {
          idFrom: i,
          idTo: batchTo
        },
        transaction
      }

      if (queryTemplate && exclusionScript !== null && tableAlias) {
        workerData.query = queryTemplate(i, batchTo, tableAlias, exclusionScript)
        workerData.params = {}
      }

      await runWorker(workerData, i, batchTo, semaphore)
      success = true
    } catch (error) {
      attempt++
      if (attempt > maxRetries) {
        console.error(`Worker processing failed after ${maxRetries} retries for batch ${i}-${batchTo}:`, error)
        throw error
      }
      const delay = baseDelay * 2 ** (attempt - 1)
      console.warn(`Retrying batch ${i}-${batchTo} (attempt ${attempt} of ${maxRetries}) after ${delay}ms due to error: ${error.message}`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
}

const processWithWorkers = async (options, maxRetries = 3, baseDelay = 500) => {
  const { batchSize, idFrom, idTo, recordType } = options

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
    await acquireSemaphore(semaphore)
    console.log(`Processing ${recordType} records ${i} to ${batchTo}`)
    await processBatchWithRetries(options, i, batchTo, semaphore, maxRetries, baseDelay)
  }
}

module.exports = {
  getEtlStageLogs,
  executeQuery,
  limitConcurrency,
  processWithWorkers
}
