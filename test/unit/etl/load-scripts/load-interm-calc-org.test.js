const { etlConfig } = require('../../../../app/config')
const db = require('../../../../app/data')
const { loadIntermCalcOrg } = require('../../../../app/etl/load-scripts/load-interm-calc-org')
const { processWithWorkers } = require('../../../../app/etl/load-scripts/load-interm-utils')

// Mock the config module
jest.mock('../../../../app/config', () => ({
  etlConfig: {
    appsPaymentNotification: {
      folder: 'Apps_Payment_Notification'
    },
    cssContractApplications: {
      folder: 'CSS_Contract_Applications'
    },
    financeDAX: {
      folder: 'Finance_DAX'
    },
    businessAddress: {
      folder: 'Business_Address'
    },
    calculationsDetails: {
      folder: 'Calculations_Details'
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
  sequelize: {
    query: jest.fn()
  },
  etlStageLog: {
    findAll: jest.fn()
  },
  Sequelize: {
    Op: {
      gt: Symbol('gt')
    }
  }
}))

jest.mock('../../../../app/etl/load-scripts/load-interm-utils', () => {
  const actual = jest.requireActual('../../../../app/etl/load-scripts/load-interm-utils')
  return {
    ...actual,
    processWithWorkers: jest.fn()
  }
})

describe('loadIntermCalcOrg', () => {
  const startDate = '2023-01-01'
  const transaction = {}

  beforeEach(() => {
    db.etlStageLog.findAll.mockClear()
    db.sequelize.query.mockClear()
    processWithWorkers.mockClear()
  })

  test('should throw an error if multiple records are found', async () => {
    const file = `${etlConfig.appsPaymentNotification.folder}/export.csv`
    db.etlStageLog.findAll.mockResolvedValue([
      { idFrom: 1, idTo: 2, file, endedAt: new Date() },
      { idFrom: 3, idTo: 4, file, endedAt: new Date() }
    ])

    await expect(loadIntermCalcOrg(startDate, transaction)).rejects.toThrow(
      `Multiple records found for updates to ${etlConfig.appsPaymentNotification.folder}, expected only one`
    )
  })

  test('should return if no records are found', async () => {
    db.etlStageLog.findAll.mockResolvedValue([])

    await expect(loadIntermCalcOrg(startDate, transaction)).resolves.toBeUndefined()
    expect(processWithWorkers).not.toHaveBeenCalled()
  })

  test('should process records with worker threads', async () => {
    const file = `${etlConfig.appsPaymentNotification.folder}/export.csv`
    db.etlStageLog.findAll.mockResolvedValue([{ idFrom: 1, idTo: 2, file, endedAt: new Date() }])
    processWithWorkers.mockResolvedValue(undefined)

    await loadIntermCalcOrg(startDate, transaction)

    expect(processWithWorkers).toHaveBeenCalled()
  })

  test('should handle errors thrown by worker threads', async () => {
    const file = `${etlConfig.appsPaymentNotification.folder}/export.csv`
    db.etlStageLog.findAll.mockResolvedValue([{ idFrom: 1, idTo: 2, file, endedAt: new Date() }])
    processWithWorkers.mockRejectedValue(new Error('Worker processing failed'))

    await expect(loadIntermCalcOrg(startDate, transaction)).rejects.toThrow('Worker processing failed')
  })
})
