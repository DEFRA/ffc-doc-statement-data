const { createKnexMock } = require('../../helpers/mock-knex')

const mockDb = createKnexMock(['etlStageLog'])

jest.mock('../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

const { runEtlProcess } = require('../../../app/etl/run-etl-process')
const { Etl, Loaders, Destinations, Transformers, Connections } = require('ffc-pay-etl-framework')
const storage = require('../../../app/storage')
const { getFirstLineNumber } = require('../../../app/etl/file-utils')
const publishEtlProcessError = require('../../../app/messaging/publish-etl-process-error')
const { Readable } = require('stream')

jest.mock('ffc-pay-etl-framework')
jest.mock('../../../app/config')
jest.mock('../../../app/storage')
jest.mock('../../../app/constants/table-mappings')
jest.mock('../../../app/etl/file-utils')
jest.mock('../../../app/messaging/publish-etl-process-error')

describe('runEtlProcess', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    global.results = []
    mockDb.builder.resolves([{ etlId: 1 }])
  })

  test('should handle ETL process correctly', async () => {
    const mockFileData = 'first line\nsecond line\nthird line\n'
    const mockFileStream = Readable.from([mockFileData])

    storage.deleteFile.mockResolvedValue()
    getFirstLineNumber.mockResolvedValue(10)

    const mockStreamAfterRemovingFirstLine = Readable.from(['second line\nthird line\n'])
    require('../../../app/etl/file-utils').removeFirstLine.mockResolvedValue(mockStreamAfterRemovingFirstLine)

    const mockEtl = {
      connection: jest.fn().mockReturnThis(),
      loader: jest.fn().mockReturnThis(),
      transform: jest.fn().mockReturnThis(),
      destination: jest.fn().mockReturnThis(),
      pump: jest.fn().mockReturnThis(),
      on: jest.fn((event, listener) => {
        if (event === 'finish') {
          listener([])
        } else if (event === 'result') {
          listener([])
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
    expect(mockDb.builder.update).toHaveBeenCalled()
    expect(publishEtlProcessError).not.toHaveBeenCalled()
  })

  test('should reject if an error occurs', async () => {
    const mockFileData = 'first line\nsecond line\nthird line\n'
    const mockFileStream = Readable.from([mockFileData])

    storage.deleteFile.mockResolvedValue()
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
      on: jest.fn((event, listener) => {
        if (event === 'error') {
          listener(error)
        }
        if (event === 'finish') {
          listener([])
        }
        if (event === 'result') {
          listener([])
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
    expect(publishEtlProcessError).toHaveBeenCalled()
  })

  test('should retry up to maxRetries and eventually throw if errors persist', async () => {
    const mockFileData = 'first line\nsecond line\nthird line\n'
    const mockFileStream = Readable.from([mockFileData])

    storage.deleteFile.mockResolvedValue()
    getFirstLineNumber.mockResolvedValue(10)

    const mockStreamAfterRemovingFirstLine = Readable.from(['second line\nthird line\n'])
    require('../../../app/etl/file-utils').removeFirstLine.mockResolvedValue(mockStreamAfterRemovingFirstLine)

    const error = new Error('Persistent ETL error')

    const mockEtl = {
      connection: jest.fn().mockReturnThis(),
      loader: jest.fn().mockReturnThis(),
      transform: jest.fn().mockReturnThis(),
      destination: jest.fn().mockReturnThis(),
      pump: jest.fn().mockReturnThis(),
      on: jest.fn((event, listener) => {
        if (event === 'error') {
          listener(error)
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

    // Spy on setTimeout to avoid real delays
    jest.spyOn(global, 'setTimeout').mockImplementation((fn) => fn())

    await expect(runEtlProcess({
      fileStream: mockFileStream,
      columns: [],
      table: 'someModel',
      mapping: {},
      transformer: {},
      nonProdTransformer: {},
      file: 'someFile'
    }, 2, 1)).rejects.toThrow('Persistent ETL error')

    expect(mockEtl.pump).toHaveBeenCalledTimes(3) // initial + 2 retries

    global.setTimeout.mockRestore()
  })

  test('should apply nonProdTransformer when fakeData is true', async () => {
    const mockFileData = 'first line\nsecond line\nthird line\n'
    const mockFileStream = Readable.from([mockFileData])
    const config = require('../../../app/config')
    config.etlConfig = { fakeData: true }
    storage.deleteFile.mockResolvedValue()
    getFirstLineNumber.mockResolvedValue(10)
    storage.downloadFileAsStream.mockResolvedValue(mockFileStream)

    const mockEtl = {
      connection: jest.fn().mockReturnThis(),
      loader: jest.fn().mockReturnThis(),
      transform: jest.fn().mockReturnThis(),
      destination: jest.fn().mockReturnThis(),
      pump: jest.fn().mockReturnThis(),
      on: jest.fn((event, listener) => {
        if (event === 'finish') {
          listener([])
        }

        if (event === 'result') {
          listener([])
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
    getFirstLineNumber.mockResolvedValue(10)
    storage.downloadFileAsStream.mockResolvedValue(mockFileStream)

    const mockEtl = {
      connection: jest.fn().mockReturnThis(),
      loader: jest.fn().mockReturnThis(),
      transform: jest.fn().mockReturnThis(),
      destination: jest.fn().mockReturnThis(),
      pump: jest.fn().mockReturnThis(),
      on: jest.fn((event, listener) => {
        if (event === 'finish') {
          listener([])
        } else if (event === 'result') {
          listener([])
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
    getFirstLineNumber.mockResolvedValue(10)
    storage.downloadFileAsStream.mockResolvedValue(mockFileStream)

    const error = new Error('ETL error event')
    const mockEtl = {
      connection: jest.fn().mockReturnThis(),
      loader: jest.fn().mockReturnThis(),
      transform: jest.fn().mockReturnThis(),
      destination: jest.fn().mockReturnThis(),
      pump: jest.fn().mockReturnThis(),
      on: jest.fn(function (event, listener) {
        if (event === 'error') {
          listener(error) // Simulate error event
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

  test('should continue ETL process if file is missing in blob storage', async () => {
    const mockFileData = 'first line\nsecond line\nthird line\n'
    const mockFileStream = Readable.from([mockFileData])

    storage.deleteFile.mockResolvedValue(false) // Simulate file not found
    getFirstLineNumber.mockResolvedValue(10)

    const mockEtl = {
      connection: jest.fn().mockReturnThis(),
      loader: jest.fn().mockReturnThis(),
      transform: jest.fn().mockReturnThis(),
      destination: jest.fn().mockReturnThis(),
      pump: jest.fn().mockReturnThis(),
      on: jest.fn((event, listener) => {
        if (event === 'finish') {
          listener([])
        } else if (event === 'result') {
          listener([])
        }

        return mockEtl
      })
    }
    Etl.Etl.mockImplementation(() => mockEtl)
    Connections.ProvidedConnection.mockResolvedValue({})
    Loaders.CSVLoader.mockImplementation(() => { })
    Transformers.FakerTransformer.mockImplementation(() => { })
    Transformers.StringReplaceTransformer.mockImplementation(() => { })
    Destinations.PostgresDestination.mockImplementation(() => { })

    const result = await runEtlProcess({
      fileStream: mockFileStream,
      columns: [],
      table: 'someModel',
      mapping: {},
      transformer: null,
      nonProdTransformer: null,
      file: 'someFile'
    })

    expect(result).toEqual([])
    expect(mockDb.builder.update).toHaveBeenCalled()
  })
})
