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

jest.mock('../../../app/messaging/publish-etl-process-error', () => jest.fn())
const publishEtlProcessError = require('../../../app/messaging/publish-etl-process-error')

const { Transaction } = require('sequelize')
Transaction.ISOLATION_LEVELS = {
  SERIALIZABLE: 'SERIALIZABLE'
}

const { loadETLData } = require('../../../app/etl/load-etl-data')
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
  loadIntermTotalDelinked,
  loadD365,
  loadIntermApplicationClaimDelinked,
  loadIntermOrgDelinked,
  loadIntermCalcOrgDelinked
} = require('../../../app/etl/load-scripts')
const { deleteETLRecords } = require('../../../app/etl/delete-etl-records')

jest.mock('../../../app/etl/delete-etl-records', () => ({
  deleteETLRecords: jest.fn().mockResolvedValue(undefined),
  createTempTables: jest.fn().mockResolvedValue(undefined),
  clearTempTables: jest.fn().mockResolvedValue(undefined),
  restoreIntermTablesFromTemp: jest.fn().mockResolvedValue(undefined)
}))
jest.mock('sequelize')
jest.mock('../../../app/etl/load-scripts')

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
    // First call returns transaction1, second returns transaction2
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
    expect(loadIntermTotalDelinked).toHaveBeenCalledWith('2023-01-01')
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
    expect(publishEtlProcessError).not.toHaveBeenCalled()
  })

  test('should rollback transactions and call deleteETLRecords if any load script fails', async () => {
    loadDAX.mockRejectedValue(new Error('Test error'))

    await expect(loadETLData('2023-01-01')).rejects.toThrow('Test error')

    expect(require('../../../app/data').sequelize.transaction).toHaveBeenCalledWith({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
    })
    expect(loadDAX).toHaveBeenCalledTimes(4) // initial call and the 3 retries
    expect(loadDAX).toHaveBeenCalledWith('2023-01-01', transaction1)
    expect(transaction1.commit).not.toHaveBeenCalled()
    expect(transaction2.commit).not.toHaveBeenCalled()
    expect(transaction1.rollback).toHaveBeenCalled()
    expect(transaction2.rollback).toHaveBeenCalled()
    expect(deleteETLRecords).toHaveBeenCalledWith('2023-01-01')
    expect(publishEtlProcessError).toHaveBeenCalled()
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

    // Spy on setTimeout to avoid real delays
    jest.spyOn(global, 'setTimeout').mockImplementation((fn) => fn())

    await expect(loadETLData('2023-01-01')).resolves.not.toThrow()
    expect(loadDAX).toHaveBeenCalledTimes(3)

    global.setTimeout.mockRestore()
  })

  test('should throw after max retries if a load script keeps failing', async () => {
    loadDAX.mockImplementation(async () => {
      throw new Error('Persistent error')
    })

    // Spy on setTimeout to avoid real delays
    jest.spyOn(global, 'setTimeout').mockImplementation((fn) => fn())

    await expect(loadETLData('2023-01-01')).rejects.toThrow('Persistent error')
    expect(loadDAX).toHaveBeenCalledTimes(4) // initial + 3 retries

    global.setTimeout.mockRestore()
    expect(publishEtlProcessError).toHaveBeenCalled()
  })
})
