const { Etl, Loaders, Destinations, Transformers, Connections } = require('ffc-pay-etl-framework')
const fs = require('fs')
const readline = require('readline')
const storage = require('../../../app/storage')
const tableMappings = require('../../../app/constants/table-mappings')
const { getFirstLineNumber, removeFirstLine, runEtlProcess } = require('../../../app/etl/run-etl-process')

jest.mock('fs')
jest.mock('readline')
jest.mock('../../../app/config')
jest.mock('../../../app/storage')
jest.mock('../../../app/data', () => ({
  __esModule: true,
  default: {
    sequelize: {
      authenticate: jest.fn(),
      close: jest.fn()
    },
    Sequelize: jest.fn(),
    etlStageLog: {
      create: jest.fn(),
      update: jest.fn()
    }
  }
}))
jest.mock('ffc-pay-etl-framework')

fs.promises = {
  readFile: jest.fn(),
  writeFile: jest.fn(),
  unlink: jest.fn()
}

describe('ETL Process', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getFirstLineNumber', () => {
    test('should return the first line number from the file', async () => {
      const filePath = 'test-file-path'
      const mockReadable = { destroy: jest.fn() }
      const mockReader = { on: jest.fn(), close: jest.fn() }

      fs.createReadStream.mockReturnValue(mockReadable)
      readline.createInterface.mockReturnValue(mockReader)

      let lineCallback
      mockReader.on.mockImplementation((event, callback) => {
        if (event === 'line') {
          lineCallback = callback
        }
      })

      const promise = getFirstLineNumber(filePath)

      lineCallback('42')

      const result = await promise

      expect(result).toBe(42)
      expect(mockReader.close).toHaveBeenCalled()
      expect(mockReadable.destroy).toHaveBeenCalled()
    })

    test('should handle errors', async () => {
      const filePath = 'test-file-path'
      const mockReadable = { destroy: jest.fn() }
      const mockReader = { on: jest.fn(), close: jest.fn() }

      fs.createReadStream.mockReturnValue(mockReadable)
      readline.createInterface.mockReturnValue(mockReader)

      let errorCallback
      mockReader.on.mockImplementation((event, callback) => {
        if (event === 'error') {
          errorCallback = callback
        }
      })

      const promise = getFirstLineNumber(filePath)

      const error = new Error('Test error')
      errorCallback(error)

      await expect(promise).rejects.toThrow('Test error')
      expect(mockReadable.destroy).toHaveBeenCalled()
    })
  })

  describe('removeFirstLine', () => {
    test('should remove the first line from the file', async () => {
      const filePath = 'test-file-path'
      const fileContent = 'first line\nsecond line\nthird line'
      const expectedContent = 'second line\nthird line'

      fs.promises.readFile.mockResolvedValue(fileContent)
      fs.promises.writeFile.mockResolvedValue()

      await removeFirstLine(filePath)

      expect(fs.promises.readFile).toHaveBeenCalledWith(filePath, 'utf8')
      expect(fs.promises.writeFile).toHaveBeenCalledWith(filePath, expectedContent)
    })
  })

  describe('runEtlProcess', () => {
    beforeEach(() => {
      jest.mock('../../../app/etl/run-etl-process', () => {
        const originalModule = jest.requireActual('../../../app/etl/run-etl-process')
        return {
          ...originalModule,
          getFirstLineNumber: jest.fn().mockResolvedValue(100)
        }
      })
    })

    afterEach(() => {
      jest.resetModules()
    })

    test.skip('should run the ETL process successfully', async (done) => {
      const params = {
        tempFilePath: 'test-temp-file-path',
        columns: ['col1', 'col2'],
        table: 'testTable',
        mapping: {},
        transformer: {},
        nonProdTransformer: {},
        file: 'test-file'
      }

      const mockEtl = {
        connection: jest.fn().mockReturnThis(),
        loader: jest.fn().mockReturnThis(),
        transform: jest.fn().mockReturnThis(),
        destination: jest.fn().mockReturnThis(),
        pump: jest.fn().mockReturnThis(),
        on: jest.fn().mockReturnThis()
      }

      Etl.Etl.mockImplementation(() => mockEtl)
      Connections.PostgresDatabaseConnection.mockResolvedValue({})
      Loaders.CSVLoader.mockImplementation(() => {})
      Transformers.FakerTransformer.mockImplementation(() => {})
      Transformers.StringReplaceTransformer.mockImplementation(() => {})
      Destinations.PostgresDestination.mockImplementation(() => {})

      const db = require('../../../app/data').default
      db[tableMappings[params.table]] = {
        count: jest.fn().mockResolvedValue(0),
        max: jest.fn().mockResolvedValue(0)
      }

      fs.existsSync.mockReturnValue(true)
      fs.promises.unlink.mockResolvedValue()
      storage.deleteFile.mockResolvedValue()

      const result = await runEtlProcess(params)

      expect(result).toBeDefined()
      expect(mockEtl.connection).toHaveBeenCalled()
      expect(mockEtl.loader).toHaveBeenCalled()
      expect(mockEtl.transform).toHaveBeenCalled()
      expect(mockEtl.destination).toHaveBeenCalled()
      expect(mockEtl.pump).toHaveBeenCalled()
      done()
    })

    test.skip('should handle errors during the ETL process', async (done) => {
      const params = {
        tempFilePath: 'test-temp-file-path',
        columns: ['col1', 'col2'],
        table: 'testTable',
        mapping: {},
        transformer: {},
        nonProdTransformer: {},
        file: 'test-file'
      }

      const mockEtl = {
        connection: jest.fn().mockReturnThis(),
        loader: jest.fn().mockReturnThis(),
        transform: jest.fn().mockReturnThis(),
        destination: jest.fn().mockReturnThis(),
        pump: jest.fn().mockReturnThis(),
        on: jest.fn().mockReturnThis()
      }

      Etl.Etl.mockImplementation(() => mockEtl)
      Connections.PostgresDatabaseConnection.mockResolvedValue({})
      Loaders.CSVLoader.mockImplementation(() => {})
      Transformers.FakerTransformer.mockImplementation(() => {})
      Transformers.StringReplaceTransformer.mockImplementation(() => {})
      Destinations.PostgresDestination.mockImplementation(() => {})

      const db = require('../../../app/data').default
      db[tableMappings[params.table]] = {
        count: jest.fn().mockResolvedValue(0),
        max: jest.fn().mockResolvedValue(0)
      }

      fs.existsSync.mockReturnValue(true)
      fs.promises.unlink.mockResolvedValue()
      storage.deleteFile.mockResolvedValue()

      const error = new Error('Test error')
      mockEtl.pump.mockImplementationOnce(() => {
        throw error
      })

      await expect(runEtlProcess(params)).rejects.toThrow('Test error')
      expect(fs.promises.unlink).toHaveBeenCalledWith(params.tempFilePath)
      done()
    })
  })
})
