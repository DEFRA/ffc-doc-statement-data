const { etlConfig } = require('../../../../app/config')
const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['etlStageLog'])
const { loadIntermAppCalcResultsDelinkPayment } = require('../../../../app/etl/load-scripts/load-interm-app-calc-results-delink-payment')
const { processWithWorkers } = require('../../../../app/etl/load-scripts/load-interm-utils')

// Mock the config module
jest.mock('../../../../app/config', () => ({
  etlConfig: {
    appCalculationResultsDelinkPayments: {
      folder: 'appCalculationResultsDelinkPayments'
    },
    calculationsDetailsDelinked: {
      folder: 'calculationsDetailsDelinked'
    },
    businessAddressDelinked: {
      folder: 'businessAddressDelinked'
    },
    applicationDetailDelinked: {
      folder: 'applicationDetailDelinked'
    },
    defraLinksDelinked: {
      folder: 'defraLinksDelinked'
    },
    organisationDelinked: {
      folder: 'organisationDelinked'
    },
    etlBatchSize: 1000
  },
  dbConfig: {
    test: {
      schema: 'test_schema'
    }
  },
  env: 'test'
}))

jest.mock('../../../../app/data', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))

jest.mock('../../../../app/etl/load-scripts/load-interm-utils', () => {
  const actual = jest.requireActual('../../../../app/etl/load-scripts/load-interm-utils')
  return {
    ...actual,
    processWithWorkers: jest.fn()
  }
})

describe('loadIntermAppCalcResultsDelinkPayment', () => {
  const startDate = '2023-01-01'
  const transaction = {}

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should throw an error if multiple records are found', async () => {
    const file = `${etlConfig.appCalculationResultsDelinkPayments.folder}/export.csv`
    mockDb.builder.resolves([
      { idFrom: 1, idTo: 2, file, endedAt: new Date() },
      { idFrom: 3, idTo: 4, file, endedAt: new Date() }
    ])

    await expect(loadIntermAppCalcResultsDelinkPayment(startDate, transaction)).rejects.toThrow(
      `Multiple records found for updates to ${etlConfig.appCalculationResultsDelinkPayments.folder}, expected only one`
    )
  })

  test('should return if no records are found', async () => {
    mockDb.builder.resolves([])

    await expect(loadIntermAppCalcResultsDelinkPayment(startDate, transaction)).resolves.toBeUndefined()
    expect(processWithWorkers).not.toHaveBeenCalled()
  })

  test('should process records with worker threads', async () => {
    const file = `${etlConfig.appCalculationResultsDelinkPayments.folder}/export.csv`
    mockDb.builder.resolves([{ idFrom: 1, idTo: 2, file, endedAt: new Date() }])
    processWithWorkers.mockResolvedValue(undefined)

    await loadIntermAppCalcResultsDelinkPayment(startDate, transaction)

    expect(processWithWorkers).toHaveBeenCalled()
  })

  test('should handle errors thrown by worker threads', async () => {
    const file = `${etlConfig.appCalculationResultsDelinkPayments.folder}/export.csv`
    mockDb.builder.resolves([{ idFrom: 1, idTo: 2, file, endedAt: new Date() }])
    processWithWorkers.mockRejectedValue(new Error('Worker processing failed'))

    await expect(loadIntermAppCalcResultsDelinkPayment(startDate, transaction)).rejects.toThrow('Worker processing failed')
  })
})
