const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageAppsPaymentNotification')

describe('etlStageAppsPaymentNotification Model', () => {
  let etlStageAppsPaymentNotification

  beforeAll(() => {
    etlStageAppsPaymentNotification = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageAppsPaymentNotification.getTableName().name).toBe('etlStageAppsPaymentNotification')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageAppsPaymentNotification.rawAttributes

    expect(attributes.changeType).toBeDefined()
    expect(attributes.changeType.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.changeTime).toBeDefined()
    expect(attributes.changeTime.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.etlId).toBeDefined()
    expect(attributes.etlId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.etlInsertedDt).toBeDefined()
    expect(attributes.etlInsertedDt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.applicationId).toBeDefined()
    expect(attributes.applicationId.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.idClcHeader).toBeDefined()
    expect(attributes.idClcHeader.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.notificationFlag).toBeDefined()
    expect(attributes.notificationFlag.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.invoiceNumber).toBeDefined()
    expect(attributes.invoiceNumber.type.key).toBe(DataTypes.STRING.key)
  })

  test('should have correct options', () => {
    expect(etlStageAppsPaymentNotification.options.tableName).toBe('etlStageAppsPaymentNotification')
    expect(etlStageAppsPaymentNotification.options.freezeTableName).toBe(true)
    expect(etlStageAppsPaymentNotification.options.timestamps).toBe(false)
  })
})
