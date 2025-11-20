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
      if (this.messageHandler) {
        this.messageHandler(message)
      }
    },
    emitExit: function (code) {
      if (this.exitHandler) {
        this.exitHandler(code)
      }
    }
  }
  return mockWorker
}

const mockWorkers = []
jest.mock('worker_threads', () => {
  return {
    Worker: jest.fn().mockImplementation(() => {
      const worker = createMockWorker()
      mockWorkers.push(worker)
      return worker
    })
  }
})

describe('loadIntermUtils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockWorkers.length = 0
  })

  describe('getEtlStageLogs', () => {
    const startDate = '2023-01-01'
    const folder = 'test-folder'

    test.each([
      ['should return null when no logs found', [], []],
      ['should return log when found', [{ id: 1, file: 'test-folder/export.csv' }], [{ id: 1, file: 'test-folder/export.csv' }]]
    ])('%s', async (_, mockReturn, expected) => {
      db.etlStageLog.findAll.mockResolvedValue(mockReturn)
      const result = await getEtlStageLogs(startDate, folder)
      expect(result).toEqual(expected)
    })

    test('should throw error when multiple logs found', async () => {
      db.etlStageLog.findAll.mockResolvedValue([{ id: 1 }, { id: 2 }])
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
    test.each([
      ['should limit concurrent promises', [() => Promise.resolve(1), () => Promise.resolve(2), () => Promise.resolve(3)], 2, [1, 2, 3]],
      ['should handle errors in promises', [() => Promise.resolve(1), () => Promise.reject(new Error('Failed')), () => Promise.resolve(3)], 2, 'Failed']
    ])('%s', async (_, promises, maxConcurrent, expected) => {
      if (expected === 'Failed') {
        await expect(limitConcurrency(promises, maxConcurrent)).rejects.toThrow('Failed')
      } else {
        const results = await limitConcurrency(promises, maxConcurrent)
        expect(results).toEqual(expected)
      }
    })
  })

  describe('processWithWorkers', () => {
    const query = 'SELECT * FROM test_table'
    const batchSize = 100
    const idFrom = 1
    const idTo = 100
    const transaction = {}
    const recordType = 'test'

    test('should process data with workers', async () => {
      const processPromise = processWithWorkers({ query, batchSize, idFrom, idTo, transaction, recordType })

      await new Promise(resolve => setImmediate(resolve))

      mockWorkers[0].emitMessage({ success: true })
      mockWorkers[0].emitExit(0)

      await processPromise

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
      const processPromise = processWithWorkers({ query, batchSize, idFrom, idTo, transaction, recordType })

      for (let i = 0; i < 4; i++) {
        await new Promise(resolve => {
          const check = () => {
            if (mockWorkers[i]) {
              resolve()
            } else {
              setImmediate(check)
            }
          }
          check()
        })
        mockWorkers[i].emitMessage({ success: false, error: 'Worker error' })
        mockWorkers[i].emitExit(1)
      }

      await expect(processPromise).rejects.toThrow('Batch 1-100 failed: Worker error')
    }, 5000)

    test('should handle custom query template', async () => {
      const queryTemplate = (start, end, alias, script) => `INSERT INTO test_table (id, value) VALUES (${start}, ${end})`
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

      await new Promise(resolve => setImmediate(resolve))

      mockWorkers[0].emitMessage({ success: true })
      mockWorkers[0].emitExit(0)

      await processPromise

      expect(Worker).toHaveBeenCalledWith(expect.any(String), {
        workerData: expect.objectContaining({
          query: expect.any(String),
          params: {}
        })
      })
    }, 5000)
  })
})
