jest.mock('../../../app/data', () => ({
  sequelize: {
    transaction: jest.fn(),
    query: jest.fn()
  },
  Sequelize: {
    Op: {
      gte: jest.fn()
    }
  },
  etlStageLog: {
    findAll: jest.fn().mockResolvedValue([])
  }
}))

jest.mock('../../../app/messaging/create-alerts', () => ({
  createAlerts: jest.fn()
}))

jest.mock('../../../app/etl/delete-etl-records', () => ({
  deleteETLRecords: jest.fn().mockResolvedValue(undefined),
  createTempTables: jest.fn().mockResolvedValue(undefined),
  clearTempTables: jest.fn().mockResolvedValue(undefined),
  restoreIntermTablesFromTemp: jest.fn().mockResolvedValue(undefined)
}))

jest.mock('sequelize')
jest.mock('../../../app/etl/load-scripts')

const { Transaction } = require('sequelize')
const { createAlerts } = require('../../../app/messaging/create-alerts')
const { loadETLData } = require('../../../app/etl/load-etl-data')
const { deleteETLRecords } = require('../../../app/etl/delete-etl-records')
const {
  loadIntermFinanceDAX,
  loadIntermCalcOrg,
  loadIntermOrg,
  loadIntermApplicationClaim,
  loadIntermApplicationContract,
  loadIntermApplicationPayment,
  loadIntermTotal,
  loadDAX,
  loadIntermTotalClaim,
  loadIntermPaymentrefApplication,
  loadIntermPaymentrefOrg,
  loadIntermPaymentrefAgreementDates,
  loadTotals,
  loadOrganisations,
  loadIntermAppCalcResultsDelinkPayment,
  loadIntermFinanceDAXDelinked,
  loadDelinkedCalculation,
  loadD365,
  loadIntermApplicationClaimDelinked,
  loadIntermOrgDelinked,
  loadIntermCalcOrgDelinked
} = require('../../../app/etl/load-scripts')

Transaction.ISOLATION_LEVELS = {
  SERIALIZABLE: 'SERIALIZABLE'
}

describe('loadETLData', () => {
  let transaction1
  let transaction2

  beforeEach(() => {
    jest.clearAllMocks()
    transaction1 = {
      commit: jest.fn(),
      rollback: jest.fn()
    }
    transaction2 = {
      commit: jest.fn(),
      rollback: jest.fn()
    }
    require('../../../app/data').sequelize.transaction
      .mockResolvedValueOnce(transaction1)
      .mockResolvedValueOnce(transaction2)
  })

  test('should commit transactions if all load scripts succeed', async () => {
    await loadETLData('2023-01-01')

    expect(require('../../../app/data').sequelize.transaction).toHaveBeenCalledWith({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
    })
    expect(loadIntermFinanceDAX).toHaveBeenCalledWith('2023-01-01')
    expect(loadIntermFinanceDAXDelinked).toHaveBeenCalledWith('2023-01-01')
    expect(loadIntermOrg).toHaveBeenCalledWith('2023-01-01')
    expect(loadIntermOrgDelinked).toHaveBeenCalledWith('2023-01-01')
    expect(loadIntermApplicationClaim).toHaveBeenCalledWith('2023-01-01')
    expect(loadIntermApplicationClaimDelinked).toHaveBeenCalledWith('2023-01-01')
    expect(loadIntermApplicationContract).toHaveBeenCalledWith('2023-01-01')
    expect(loadIntermApplicationPayment).toHaveBeenCalledWith('2023-01-01')
    expect(loadIntermCalcOrg).toHaveBeenCalledWith('2023-01-01')
    expect(loadIntermCalcOrgDelinked).toHaveBeenCalledWith('2023-01-01')
    expect(loadIntermTotal).toHaveBeenCalledWith('2023-01-01')
    expect(loadOrganisations).toHaveBeenCalledWith('2023-01-01', transaction1)
    expect(loadIntermPaymentrefAgreementDates).toHaveBeenCalledWith('2023-01-01')
    expect(loadDAX).toHaveBeenCalledWith('2023-01-01', transaction1)
    expect(transaction1.commit).toHaveBeenCalled()
    expect(loadIntermAppCalcResultsDelinkPayment).toHaveBeenCalledWith('2023-01-01')
    expect(loadIntermTotalClaim).toHaveBeenCalledWith('2023-01-01')
    expect(loadIntermPaymentrefApplication).toHaveBeenCalledWith('2023-01-01')
    expect(loadIntermPaymentrefOrg).toHaveBeenCalledWith('2023-01-01')
    expect(loadTotals).toHaveBeenCalledWith('2023-01-01', transaction2)
    expect(loadDelinkedCalculation).toHaveBeenCalledWith('2023-01-01', transaction2)
    expect(loadD365).toHaveBeenCalledWith('2023-01-01', transaction2)
    expect(transaction2.commit).toHaveBeenCalled()
    expect(transaction1.rollback).not.toHaveBeenCalled()
    expect(transaction2.rollback).not.toHaveBeenCalled()
  })

  test('should rollback transactions and call deleteETLRecords if any load script fails', async () => {
    loadDAX.mockRejectedValue(new Error('Test error'))

    await loadETLData('2023-01-01')

    expect(loadDAX).toHaveBeenCalledTimes(4) // initial call and the 3 retries
    expect(transaction1.commit).not.toHaveBeenCalled()
    expect(transaction2.commit).not.toHaveBeenCalled()
    expect(transaction1.rollback).toHaveBeenCalled()
    expect(transaction2.rollback).toHaveBeenCalled()
    expect(deleteETLRecords).toHaveBeenCalledWith('2023-01-01')
  })

  test('should retry a failing load script and succeed if it eventually passes', async () => {
    let callCount = 0
    loadDAX.mockImplementation(async () => {
      callCount++
      if (callCount < 3) {
        throw new Error('Intermittent error')
      }
      return 'success'
    })

    jest.spyOn(global, 'setTimeout').mockImplementation((fn) => fn())

    await loadETLData('2023-01-01')

    expect(loadDAX).toHaveBeenCalledTimes(3)
    expect(transaction1.commit).toHaveBeenCalled()
    expect(transaction2.commit).toHaveBeenCalled()

    global.setTimeout.mockRestore()
  })

  test('should handle failure after max retries', async () => {
    loadDAX.mockImplementation(async () => {
      throw new Error('Persistent error')
    })

    jest.spyOn(global, 'setTimeout').mockImplementation((fn) => fn())

    await loadETLData('2023-01-01')

    expect(loadDAX).toHaveBeenCalledTimes(4) // initial + 3 retries
    expect(createAlerts).toHaveBeenCalledWith([{
      file: 'Loading ETL data',
      message: 'Persistent error'
    }])

    global.setTimeout.mockRestore()
  })

  test('should call createAlerts with error details when a load script fails', async () => {
    const errorMessage = 'Test error'
    loadDAX.mockRejectedValue(new Error(errorMessage))

    await loadETLData('2023-01-01')

    expect(createAlerts).toHaveBeenCalledWith([{
      file: 'Loading ETL data',
      message: errorMessage
    }])
  })

  test('should call createAlerts after rollback and deleteETLRecords', async () => {
    const errorMessage = 'Test error'
    loadDAX.mockRejectedValue(new Error(errorMessage))

    await loadETLData('2023-01-01')

    const rollback1Call = transaction1.rollback.mock.invocationCallOrder[0]
    const rollback2Call = transaction2.rollback.mock.invocationCallOrder[0]
    const deleteETLCall = deleteETLRecords.mock.invocationCallOrder[0]
    const createAlertsCall = createAlerts.mock.invocationCallOrder[0]

    expect(createAlertsCall).toBeGreaterThan(rollback1Call)
    expect(createAlertsCall).toBeGreaterThan(rollback2Call)
    expect(createAlertsCall).toBeGreaterThan(deleteETLCall)
  })

  test('should handle transaction creation failure', async () => {
    require('../../../app/data').sequelize.transaction.mockRejectedValue(new Error('Transaction failed'))

    await loadETLData('2023-01-01')

    expect(createAlerts).toHaveBeenCalledWith([{
      file: 'Loading ETL data',
      message: 'Test error'
    }])
  })
})
