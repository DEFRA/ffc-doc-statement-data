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
  loadOrganisations
} = require('../../../app/etl/load-scripts')
jest.mock('../../../app/etl/manage-temp-tables', () => ({
  deleteETLRecords: jest.fn().mockResolvedValue(undefined),
  createTempTables: jest.fn().mockResolvedValue(undefined),
  clearTempTables: jest.fn().mockResolvedValue(undefined),
  restoreIntermTablesFromTemp: jest.fn().mockResolvedValue(undefined)
}))
jest.mock('sequelize')
jest.mock('../../../app/etl/load-scripts')

describe('loadETLData', () => {
  let transaction

  beforeEach(() => {
    jest.clearAllMocks()
    transaction = {
      commit: jest.fn(),
      rollback: jest.fn()
    }
    require('../../../app/data').sequelize.transaction.mockResolvedValue(transaction)
  })

  test('should commit transaction if all load scripts succeed', async () => {
    await loadETLData('2023-01-01')

    expect(require('../../../app/data').sequelize.transaction).toHaveBeenCalledWith({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
    })
    expect(loadIntermFinanceDAX).toHaveBeenCalledWith('2023-01-01')
    expect(loadIntermCalcOrg).toHaveBeenCalledWith('2023-01-01')
    expect(loadIntermOrg).toHaveBeenCalledWith('2023-01-01')
    expect(loadIntermApplicationClaim).toHaveBeenCalledWith('2023-01-01')
    expect(loadIntermApplicationContract).toHaveBeenCalledWith('2023-01-01')
    expect(loadIntermApplicationPayment).toHaveBeenCalledWith('2023-01-01')
    expect(loadIntermTotal).toHaveBeenCalledWith('2023-01-01')
    expect(loadDAX).toHaveBeenCalledWith('2023-01-01', transaction)
    expect(loadIntermTotalClaim).toHaveBeenCalledWith('2023-01-01')
    expect(loadIntermPaymentrefApplication).toHaveBeenCalledWith('2023-01-01')
    expect(loadIntermPaymentrefOrg).toHaveBeenCalledWith('2023-01-01')
    expect(loadIntermPaymentrefAgreementDates).toHaveBeenCalledWith('2023-01-01')
    expect(loadTotals).toHaveBeenCalledWith('2023-01-01', transaction)
    expect(loadOrganisations).toHaveBeenCalledWith('2023-01-01', transaction)
    expect(transaction.commit).toHaveBeenCalled()
    expect(transaction.rollback).not.toHaveBeenCalled()
    expect(publishEtlProcessError).not.toHaveBeenCalled()
  })

  test('should rollback transaction if any transaction load script fails', async () => {
    loadDAX.mockRejectedValue(new Error('Test error'))

    await expect(loadETLData('2023-01-01')).rejects.toThrow('Test error')

    expect(require('../../../app/data').sequelize.transaction).toHaveBeenCalledWith({
      isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
    })
    expect(loadDAX).toHaveBeenCalledWith('2023-01-01', transaction)
    expect(transaction.commit).not.toHaveBeenCalled()
    expect(transaction.rollback).toHaveBeenCalled()
    expect(publishEtlProcessError).toHaveBeenCalled()
  })
})
