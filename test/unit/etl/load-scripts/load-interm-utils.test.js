const { Worker } = require('worker_threads')
const db = require('../../../../app/data')
const { getEtlStageLogs, executeQuery, limitConcurrency, processWithWorkers } = require('../../../../app/etl/load-scripts/load-interm-utils')

jest.mock('../../../../app/data', () => ({
  sequelize: {
    query: jest.fn()
  },
  etlStageLog: {
    findAll: jest.fn()
  },
  Sequelize: {
    Op: {
      gt: 'gt'
    }
  }
}))

// Create a mock worker instance that can be reused
const createMockWorker = () => {
  const mockWorker = {
    on: jest.fn((event, callback) => {
      if (event === 'message') {
        mockWorker.messageHandler = callback
      } else if (event === 'exit') {
        mockWorker.exitHandler = callback
      }
    }),
    terminate: jest.fn().mockResolvedValue(undefined),
    postMessage: jest.fn(),
    messageHandler: null,
    exitHandler: null,
    emitMessage: function (message) {
      if (this.messageHandler) this.messageHandler(message)
    },
    emitExit: function (code) {
      if (this.exitHandler) this.exitHandler(code)
    }
  }
  return mockWorker
}

// Mock the Worker constructor
jest.mock('worker_threads', () => {
  const mockWorker = createMockWorker()

  return {
    Worker: jest.fn().mockImplementation((path, options) => {
      // Store the arguments for verification in tests
      mockWorker.constructorArgs = { path, options }
      return mockWorker
    })
  }
})

describe('load-interm-utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getEtlStageLogs', () => {
    const startDate = '2023-01-01'
    const folder = 'test-folder'

    test('should return null when no logs found', async () => {
      db.etlStageLog.findAll.mockResolvedValue([])

      const result = await getEtlStageLogs(startDate, folder)
      expect(result).toEqual([])
    })

    test('should return log when found', async () => {
      const mockLog = { id: 1, file: 'test-folder/export.csv' }
      db.etlStageLog.findAll.mockResolvedValue([mockLog])

      const result = await getEtlStageLogs(startDate, folder)
      expect(result).toEqual([mockLog])
    })

    test('should throw error when multiple logs found', async () => {
      db.etlStageLog.findAll.mockResolvedValue([
        { id: 1 },
        { id: 2 }
      ])

      await expect(getEtlStageLogs(startDate, folder)).rejects.toThrow('Multiple records found')
    })

    test('should handle array of folders', async () => {
      const folders = ['folder1', 'folder2']
      const mockLogs = [
        [{ id: 1, file: 'folder1/export.csv' }],
        [{ id: 2, file: 'folder2/export.csv' }]
      ]

      db.etlStageLog.findAll
        .mockResolvedValueOnce(mockLogs[0])
        .mockResolvedValueOnce(mockLogs[1])

      const result = await getEtlStageLogs(startDate, folders)
      expect(result).toEqual(mockLogs.map(log => log[0]))
    })
  })

  describe('executeQuery', () => {
    test('should execute query with correct parameters', async () => {
      const query = 'SELECT * FROM table'
      const replacements = { param: 'value' }
      const transaction = {}

      await executeQuery(query, replacements, transaction)

      expect(db.sequelize.query).toHaveBeenCalledWith(query, {
        replacements,
        raw: true,
        transaction
      })
    })
  })

  describe('limitConcurrency', () => {
    test('should limit concurrent promises', async () => {
      const promises = [
        () => Promise.resolve(1),
        () => Promise.resolve(2),
        () => Promise.resolve(3)
      ]
      const maxConcurrent = 2

      const results = await limitConcurrency(promises, maxConcurrent)
      expect(results).toEqual([1, 2, 3])
    })

    test('should handle errors in promises', async () => {
      const promises = [
        () => Promise.resolve(1),
        () => Promise.reject(new Error('Failed')),
        () => Promise.resolve(3)
      ]
      const maxConcurrent = 2

      await expect(limitConcurrency(promises, maxConcurrent)).rejects.toThrow('Failed')
    })
  })

  describe('processWithWorkers', () => {
    let mockWorker

    beforeEach(() => {
      jest.clearAllMocks()
      mockWorker = require('worker_threads').Worker()
    })

    test('should process data with workers', async () => {
      const query = 'SELECT * FROM test_table'
      const batchSize = 100
      const idFrom = 1
      const idTo = 100 // Reduced to just one batch
      const transaction = {}
      const recordType = 'test'

      const processPromise = processWithWorkers({
        query,
        batchSize,
        idFrom,
        idTo,
        transaction,
        recordType
      })

      // Wait for the worker to be set up
      await new Promise(resolve => setImmediate(resolve))

      // Simulate successful completion
      mockWorker.emitMessage({ success: true })
      mockWorker.emitExit(0)

      await processPromise

      // Verify the Worker constructor was called with the correct arguments
      expect(Worker).toHaveBeenCalledWith(expect.any(String), {
        workerData: expect.objectContaining({
          query,
          params: {
            idFrom: 1,
            idTo: 100
          },
          transaction
        })
      })
    }, 5000)

    test('should handle worker errors', async () => {
      const query = 'SELECT * FROM test_table'
      const batchSize = 100
      const idFrom = 1
      const idTo = 100 // Reduced to just one batch
      const transaction = {}
      const recordType = 'test'

      const processPromise = processWithWorkers({
        query,
        batchSize,
        idFrom,
        idTo,
        transaction,
        recordType
      })

      // Wait for the worker to be set up
      await new Promise(resolve => setImmediate(resolve))

      // Simulate error
      mockWorker.emitMessage({ success: false, error: 'Worker error' })
      mockWorker.emitExit(1)

      await expect(processPromise).rejects.toThrow('Batch 1-100 failed: Worker error')
    }, 5000)

    test('should handle custom query template', async () => {
      const query = 'SELECT * FROM test_table'
      const batchSize = 100
      const idFrom = 1
      const idTo = 100 // Reduced to just one batch
      const transaction = {}
      const recordType = 'test'
      const queryTemplate = (start, end, alias, script) =>
        `INSERT INTO test_table (id, value) VALUES (${start}, ${end})`
      const exclusionScript = 'test script'
      const tableAlias = 'test_alias'

      const processPromise = processWithWorkers({
        query,
        batchSize,
        idFrom,
        idTo,
        transaction,
        recordType,
        queryTemplate,
        exclusionScript,
        tableAlias
      })

      // Wait for the worker to be set up
      await new Promise(resolve => setImmediate(resolve))

      // Simulate successful completion
      mockWorker.emitMessage({ success: true })
      mockWorker.emitExit(0)

      await processPromise

      // Verify the Worker constructor was called with the correct arguments
      expect(Worker).toHaveBeenCalledWith(expect.any(String), {
        workerData: expect.objectContaining({
          query: expect.any(String),
          params: {}
        })
      })
    }, 5000)
  })
})
