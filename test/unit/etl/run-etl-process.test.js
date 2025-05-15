/* eslint-disable n/no-callback-literal */
const { runEtlProcess } = require('../../../app/etl/run-etl-process')
const { Etl, Loaders, Destinations, Transformers, Connections } = require('ffc-pay-etl-framework')
const storage = require('../../../app/storage')
const db = require('../../../app/data')
const { getFirstLineNumber } = require('../../../app/etl/file-utils')
const { Readable } = require('stream')

jest.mock('ffc-pay-etl-framework')
jest.mock('../../../app/config')
jest.mock('../../../app/storage')
jest.mock('../../../app/data', () => ({
  sequelize: {
    authenticate: jest.fn(),
    close: jest.fn(),
    query: jest.fn()
  },
  Sequelize: jest.fn(),
  etlStageLog: {
    create: jest.fn(),
    update: jest.fn()
  },
  etlStageApplicationDetail: {
    create: jest.fn()
  }
}))
jest.mock('../../../app/constants/table-mappings')
jest.mock('../../../app/etl/file-utils')

describe('runEtlProcess', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.results = []
  })

  test('should handle ETL process correctly', async () => {
    const mockFileData = 'first line\nsecond line\nthird line\n'
    const mockFileStream = Readable.from([mockFileData])

    storage.deleteFile.mockResolvedValue()
    db.etlStageLog.create.mockResolvedValue({ etl_id: 1 })
    db.etlStageLog.update.mockResolvedValue()
    db.etlStageApplicationDetail.create.mockResolvedValue()
    db.someModel = { count: jest.fn().mockResolvedValue(0), max: jest.fn().mockResolvedValue(0) }
    getFirstLineNumber.mockResolvedValue(10)

    const mockStreamAfterRemovingFirstLine = Readable.from(['second line\nthird line\n'])
    require('../../../app/etl/file-utils').removeFirstLine.mockResolvedValue(mockStreamAfterRemovingFirstLine)

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
    Connections.ProvidedConnection.mockResolvedValue({})
    Loaders.CSVLoader.mockImplementation(() => {})
    Transformers.FakerTransformer.mockImplementation(() => {})
    Transformers.StringReplaceTransformer.mockImplementation(() => {})
    Destinations.PostgresDestination.mockImplementation(() => {})

    const result = await runEtlProcess({
      fileStream: mockFileStream,
      columns: [],
      table: 'someTable',
      mapping: {},
      transformer: {},
      nonProdTransformer: {},
      file: 'someFile'
    })

    expect(result).toEqual([])
    expect(storage.deleteFile).toHaveBeenCalledWith('someFile')
    expect(db.etlStageLog.update).toHaveBeenCalled()
  })

  test('should reject if an error occurs', async () => {
    const mockFileData = 'first line\nsecond line\nthird line\n'
    const mockFileStream = Readable.from([mockFileData])

    storage.deleteFile.mockResolvedValue()
    db.etlStageLog.create.mockResolvedValue({ etl_id: 1 })
    db.etlStageLog.update.mockResolvedValue()
    db.etlStageApplicationDetail.create.mockResolvedValue()
    db.someModel = { count: jest.fn().mockResolvedValue(0), max: jest.fn().mockResolvedValue(0) }
    getFirstLineNumber.mockResolvedValue(10)

    const mockStreamAfterRemovingFirstLine = Readable.from(['second line\nthird line\n'])
    require('../../../app/etl/file-utils').removeFirstLine.mockResolvedValue(mockStreamAfterRemovingFirstLine)

    const error = new Error('Test error')

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
    Connections.ProvidedConnection.mockResolvedValue({})
    Loaders.CSVLoader.mockImplementation(() => {})
    Transformers.FakerTransformer.mockImplementation(() => {})
    Transformers.StringReplaceTransformer.mockImplementation(() => {})
    Destinations.PostgresDestination.mockImplementation(() => {})

    mockEtl.pump.mockImplementationOnce(() => {
      throw error
    })

    await expect(runEtlProcess({
      fileStream: mockFileStream,
      columns: [],
      table: 'someTable',
      mapping: {},
      transformer: {},
      nonProdTransformer: {},
      file: 'someFile'
    })).rejects.toThrow('Test error')
  })

  test('should apply nonProdTransformer when fakeData is true', async () => {
    const mockFileData = 'first line\nsecond line\nthird line\n'
    const mockFileStream = Readable.from([mockFileData])
    const config = require('../../../app/config')
    config.etlConfig = { fakeData: true }
    storage.deleteFile.mockResolvedValue()
    db.etlStageLog.create.mockResolvedValue({ etlId: 1 })
    db.etlStageLog.update.mockResolvedValue()
    db.someModel = { count: jest.fn().mockResolvedValue(0), max: jest.fn().mockResolvedValue(0) }
    getFirstLineNumber.mockResolvedValue(10)
    storage.downloadFileAsStream.mockResolvedValue(mockFileStream)

    const mockEtl = {
      connection: jest.fn().mockReturnThis(),
      loader: jest.fn().mockReturnThis(),
      transform: jest.fn().mockReturnThis(),
      destination: jest.fn().mockReturnThis(),
      pump: jest.fn().mockReturnThis(),
      on: jest.fn((event, callback) => {
        if (event === 'finish') callback([])
        if (event === 'result') callback([])
        return mockEtl
      })
    }
    Etl.Etl.mockImplementation(() => mockEtl)
    Connections.ProvidedConnection.mockResolvedValue({})
    Loaders.CSVLoader.mockImplementation(() => {})
    Transformers.FakerTransformer.mockImplementation(() => {})
    Transformers.StringReplaceTransformer.mockImplementation(() => {})
    Destinations.PostgresDestination.mockImplementation(() => {})

    await runEtlProcess({
      fileStream: mockFileStream,
      columns: [],
      table: 'someModel',
      mapping: {},
      transformer: null,
      nonProdTransformer: { some: 'field' },
      file: 'someFile'
    })

    expect(Transformers.FakerTransformer).toHaveBeenCalled()
  })

  test('should apply transformer if provided', async () => {
    const mockFileData = 'first line\nsecond line\nthird line\n'
    const mockFileStream = Readable.from([mockFileData])
    storage.deleteFile.mockResolvedValue()
    db.etlStageLog.create.mockResolvedValue({ etlId: 1 })
    db.etlStageLog.update.mockResolvedValue()
    db.someModel = { count: jest.fn().mockResolvedValue(0), max: jest.fn().mockResolvedValue(0) }
    getFirstLineNumber.mockResolvedValue(10)
    storage.downloadFileAsStream.mockResolvedValue(mockFileStream)

    const mockEtl = {
      connection: jest.fn().mockReturnThis(),
      loader: jest.fn().mockReturnThis(),
      transform: jest.fn().mockReturnThis(),
      destination: jest.fn().mockReturnThis(),
      pump: jest.fn().mockReturnThis(),
      on: jest.fn((event, callback) => {
        if (event === 'finish') callback([])
        if (event === 'result') callback([])
        return mockEtl
      })
    }
    Etl.Etl.mockImplementation(() => mockEtl)
    Connections.ProvidedConnection.mockResolvedValue({})
    Loaders.CSVLoader.mockImplementation(() => {})
    Transformers.FakerTransformer.mockImplementation(() => {})
    Transformers.StringReplaceTransformer.mockImplementation(() => {})
    Destinations.PostgresDestination.mockImplementation(() => {})

    await runEtlProcess({
      fileStream: mockFileStream,
      columns: [],
      table: 'someModel',
      mapping: {},
      transformer: { replace: 'something' },
      nonProdTransformer: null,
      file: 'someFile'
    })

    expect(Transformers.StringReplaceTransformer).toHaveBeenCalled()
  })

  test('should handle ETL error event and reject', async () => {
    const mockFileData = 'first line\nsecond line\nthird line\n'
    const mockFileStream = Readable.from([mockFileData])
    storage.deleteFile.mockResolvedValue()
    db.etlStageLog.create.mockResolvedValue({ etlId: 1 })
    db.etlStageLog.update.mockResolvedValue()
    db.someModel = { count: jest.fn().mockResolvedValue(0), max: jest.fn().mockResolvedValue(0) }
    getFirstLineNumber.mockResolvedValue(10)
    storage.downloadFileAsStream.mockResolvedValue(mockFileStream)

    const error = new Error('ETL error event')
    const mockEtl = {
      connection: jest.fn().mockReturnThis(),
      loader: jest.fn().mockReturnThis(),
      transform: jest.fn().mockReturnThis(),
      destination: jest.fn().mockReturnThis(),
      pump: jest.fn().mockReturnThis(),
      on: jest.fn(function (event, callback) {
        if (event === 'error') {
          // Simulate error event
          callback(error)
        }
        return this
      })
    }
    Etl.Etl.mockImplementation(() => mockEtl)
    Connections.ProvidedConnection.mockResolvedValue({})
    Loaders.CSVLoader.mockImplementation(() => {})
    Transformers.FakerTransformer.mockImplementation(() => {})
    Transformers.StringReplaceTransformer.mockImplementation(() => {})
    Destinations.PostgresDestination.mockImplementation(() => {})

    await expect(runEtlProcess({
      fileStream: mockFileStream,
      columns: [],
      table: 'someModel',
      mapping: {},
      transformer: null,
      nonProdTransformer: null,
      file: 'someFile'
    })).rejects.toThrow('ETL error event')
  })
})
