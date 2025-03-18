const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageAppsPaymentNotification')

describe('etlStageAppsPaymentNotification Model', () => {
  let etlStageAppsPaymentNotification

  beforeAll(() => {
    etlStageAppsPaymentNotification = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageAppsPaymentNotification.getTableName()).toBe('etlStageAppsPaymentNotification')
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

    expect(attributes.notificationDt).toBeDefined()
    expect(attributes.notificationDt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.notificationFlag).toBeDefined()
    expect(attributes.notificationFlag.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.notifierKey).toBeDefined()
    expect(attributes.notifierKey.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.notificationText).toBeDefined()
    expect(attributes.notificationText.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.invoiceNumber).toBeDefined()
    expect(attributes.invoiceNumber.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.requestInvoiceNumber).toBeDefined()
    expect(attributes.requestInvoiceNumber.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.pillar).toBeDefined()
    expect(attributes.pillar.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.deliveryBodyCode).toBeDefined()
    expect(attributes.deliveryBodyCode.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.paymentPreferenceCurrency).toBeDefined()
    expect(attributes.paymentPreferenceCurrency.type.key).toBe(DataTypes.STRING.key)
  })

  test('should have correct options', () => {
    expect(etlStageAppsPaymentNotification.options.tableName).toBe('etlStageAppsPaymentNotification')
    expect(etlStageAppsPaymentNotification.options.freezeTableName).toBe(true)
    expect(etlStageAppsPaymentNotification.options.timestamps).toBe(false)
  })
})
