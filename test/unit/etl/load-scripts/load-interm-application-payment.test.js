const { etlConfig } = require('../../../../app/config')
const db = require('../../../../app/data')
const { loadIntermApplicationPayment } = require('../../../../app/etl/load-scripts/load-interm-application-payment')

jest.mock('../../../../app/data')

describe('loadIntermApplicationPayment', () => {
  beforeEach(() => {
    db.etlStageLog.findAll.mockClear()
    db.sequelize.query.mockClear()
  })

  test('should throw an error if multiple records are found', async () => {
    const startDate = new Date('2023-01-01')
    db.etlStageLog.findAll.mockResolvedValue([{ file: 'Apps_Payment_Notification/export.csv', idFrom: 1, idTo: 2 }, { file: 'Apps_Payment_Notification/export.csv', idFrom: 3, idTo: 4 }])

    await expect(loadIntermApplicationPayment(startDate)).rejects.toThrow(
      `Multiple records found for updates to ${etlConfig.appsPaymentNotification.folder}, expected only one`
    )
  })

  test('should return if no records are found', async () => {
    const startDate = new Date('2023-01-01')
    db.etlStageLog.findAll.mockResolvedValue([])

    await loadIntermApplicationPayment(startDate)

    expect(db.sequelize.query).not.toHaveBeenCalled()
  })

  test('should call sequelize.query with correct parameters if one record is found', async () => {
    const startDate = new Date('2023-01-01')
    db.etlStageLog.findAll.mockResolvedValue([{ file: 'Apps_Payment_Notification/export.csv', idFrom: 1, idTo: 2 }])

    await loadIntermApplicationPayment(startDate)

    expect(db.sequelize.query).toMatchSnapshot()
  })
})
