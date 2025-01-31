/* eslint-disable n/no-callback-literal */
const { runEtlProcess } = require('../../../app/etl/run-etl-process')
const { Etl, Loaders, Destinations, Transformers, Connections } = require('ffc-pay-etl-framework')
const fs = require('fs')
const storage = require('../../../app/storage')
const db = require('../../../app/data')
const { removeFirstLine, getFirstLineNumber } = require('../../../app/etl/file-utils')
const publishEtlProcessError = require('../../../app/messaging/publish-etl-process-error')

jest.mock('ffc-pay-etl-framework')
jest.mock('fs')
jest.mock('../../../app/config')
jest.mock('../../../app/storage')
jest.mock('../../../app/data', () => ({
  sequelize: {
    authenticate: jest.fn(),
    close: jest.fn()
  },
  Sequelize: jest.fn(),
  etlStageLog: {
    create: jest.fn(),
    update: jest.fn()
  }
}))
jest.mock('../../../app/constants/table-mappings')
jest.mock('../../../app/etl/file-utils')
jest.mock('../../../app/messaging/publish-etl-process-error')

fs.promises = {
  readFile: jest.fn(),
  writeFile: jest.fn(),
  unlink: jest.fn()
}

describe('runEtlProcess', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.results = []
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  test('should resolve true if tempFilePath does not exist', async () => {
    fs.existsSync.mockReturnValue(false)

    const result = await runEtlProcess({ tempFilePath: 'path/to/temp/file' })

    expect(result).toBe(true)
  })

  test('should handle ETL process correctly', async () => {
    fs.existsSync.mockReturnValue(true)
    fs.promises.unlink.mockResolvedValue()
    storage.deleteFile.mockResolvedValue()
    db.etlStageLog.create.mockResolvedValue({ etl_id: 1 })
    db.etlStageLog.update.mockResolvedValue()
    db.someModel = { count: jest.fn().mockResolvedValue(0), max: jest.fn().mockResolvedValue(0) }
    getFirstLineNumber.mockResolvedValue(10)
    removeFirstLine.mockResolvedValue()

    const mockEtl = {
      connection: jest.fn().mockReturnThis(),
      loader: jest.fn().mockReturnThis(),
      transform: jest.fn().mockReturnThis(),
      destination: jest.fn().mockReturnThis(),
      pump: jest.fn().mockReturnThis(),
      on: jest.fn((event, callback) => {
        if (event === 'finish') {
          callback([])
        }
        if (event === 'result') {
          callback([])
        }
        return mockEtl
      })
    }

    Etl.Etl.mockImplementation(() => mockEtl)
    Connections.PostgresDatabaseConnection.mockResolvedValue({})
    Loaders.CSVLoader.mockImplementation(() => {})
    Transformers.FakerTransformer.mockImplementation(() => {})
    Transformers.StringReplaceTransformer.mockImplementation(() => {})
    Destinations.PostgresDestination.mockImplementation(() => {})

    const result = await runEtlProcess({
      tempFilePath: 'path/to/temp/file',
      columns: [],
      table: 'someTable',
      mapping: {},
      transformer: {},
      nonProdTransformer: {},
      file: 'someFile'
    })

    expect(result).toEqual([])
    expect(fs.promises.unlink).toHaveBeenCalledWith('path/to/temp/file')
    expect(storage.deleteFile).toHaveBeenCalledWith('someFile')
    expect(db.etlStageLog.update).toHaveBeenCalled()
    expect(publishEtlProcessError).not.toHaveBeenCalled()
  })

  test('should reject if an error occurs', async () => {
    fs.existsSync.mockReturnValue(true)
    fs.promises.unlink.mockResolvedValue()
    storage.deleteFile.mockResolvedValue()
    db.etlStageLog.create.mockResolvedValue({ etl_id: 1 })
    db.etlStageLog.update.mockResolvedValue()
    db.someModel = { count: jest.fn().mockResolvedValue(0), max: jest.fn().mockResolvedValue(0) }
    getFirstLineNumber.mockResolvedValue(10)
    removeFirstLine.mockResolvedValue()

    const mockEtl = {
      connection: jest.fn().mockReturnThis(),
      loader: jest.fn().mockReturnThis(),
      transform: jest.fn().mockReturnThis(),
      destination: jest.fn().mockReturnThis(),
      pump: jest.fn().mockReturnThis(),
      on: jest.fn((event, callback) => {
        if (event === 'finish') {
          callback([])
        }
        if (event === 'result') {
          callback([])
        }
        return mockEtl
      })
    }

    Etl.Etl.mockImplementation(() => mockEtl)
    Connections.PostgresDatabaseConnection.mockResolvedValue({})
    Loaders.CSVLoader.mockImplementation(() => {})
    Transformers.FakerTransformer.mockImplementation(() => {})
    Transformers.StringReplaceTransformer.mockImplementation(() => {})
    Destinations.PostgresDestination.mockImplementation(() => {})

    const error = new Error('Test error')
    mockEtl.pump.mockImplementationOnce(() => {
      throw error
    })

    await expect(runEtlProcess({
      tempFilePath: 'path/to/temp/file',
      columns: [],
      table: 'someTable',
      mapping: {},
      transformer: {},
      nonProdTransformer: {},
      file: 'someFile'
    })).rejects.toThrow('Test error')

    expect(fs.promises.unlink).toHaveBeenCalledWith('path/to/temp/file')
    expect(publishEtlProcessError).toHaveBeenCalled()
  })
})
