const { storageConfig } = require('../../../../app/config')
const db = require('../../../../app/data')
const { loadIntermApplicationPayment } = require('../../../../app/etl/load-scripts/load-interm-application-payment')

jest.mock('../../../../app/data')

describe('loadIntermApplicationPayment', () => {
  let mockTransaction

  beforeEach(() => {
    mockTransaction = {} // Mock transaction object
    db.etlStageLog.findAll.mockClear()
    db.sequelize.query.mockClear()
  })

  test('should throw an error if multiple records are found', async () => {
    const startDate = new Date('2023-01-01')
    db.etlStageLog.findAll.mockResolvedValue([{ id_from: 1, id_to: 2 }, { id_from: 3, id_to: 4 }])

    await expect(loadIntermApplicationPayment(startDate, mockTransaction)).rejects.toThrow(
      `Multiple records found for updates to ${storageConfig.appsPaymentNotification.folder}, expected only one`
    )
  })

  test('should return if no records are found', async () => {
    const startDate = new Date('2023-01-01')
    db.etlStageLog.findAll.mockResolvedValue([])

    await loadIntermApplicationPayment(startDate, mockTransaction)

    expect(db.sequelize.query).not.toHaveBeenCalled()
  })

  test('should call sequelize.query with correct parameters if one record is found', async () => {
    const startDate = new Date('2023-01-01')
    db.etlStageLog.findAll.mockResolvedValue([{ id_from: 1, id_to: 2 }])

    await loadIntermApplicationPayment(startDate, mockTransaction)

    expect(db.sequelize.query).toMatchSnapshot()
  })
})
