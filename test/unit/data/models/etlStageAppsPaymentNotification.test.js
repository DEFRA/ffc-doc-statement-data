const { Sequelize, DataTypes } = require('sequelize')
const sequelize = new Sequelize('sqlite::memory:')

const defineModel = require('../../../../app/data/models/etlStageAppsPaymentNotification')

describe('etlStageAppsPaymentNotification Model', () => {
  let etlStageAppsPaymentNotification

  beforeAll(() => {
    etlStageAppsPaymentNotification = defineModel(sequelize, DataTypes)
  })

  test('should have correct table name', () => {
    expect(etlStageAppsPaymentNotification.getTableName()).toBe('etl_stage_apps_payment_notification')
  })

  test('should have correct attributes', () => {
    const attributes = etlStageAppsPaymentNotification.rawAttributes

    expect(attributes.change_type).toBeDefined()
    expect(attributes.change_type.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.change_time).toBeDefined()
    expect(attributes.change_time.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.etl_id).toBeDefined()
    expect(attributes.etl_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.etl_inserted_dt).toBeDefined()
    expect(attributes.etl_inserted_dt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.application_id).toBeDefined()
    expect(attributes.application_id.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.id_clc_header).toBeDefined()
    expect(attributes.id_clc_header.type.key).toBe(DataTypes.INTEGER.key)

    expect(attributes.notification_dt).toBeDefined()
    expect(attributes.notification_dt.type.key).toBe(DataTypes.DATE.key)

    expect(attributes.notification_flag).toBeDefined()
    expect(attributes.notification_flag.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.notifier_key).toBeDefined()
    expect(attributes.notifier_key.type.key).toBe(DataTypes.DECIMAL.key)

    expect(attributes.notification_text).toBeDefined()
    expect(attributes.notification_text.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.invoice_number).toBeDefined()
    expect(attributes.invoice_number.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.request_invoice_number).toBeDefined()
    expect(attributes.request_invoice_number.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.pillar).toBeDefined()
    expect(attributes.pillar.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.delivery_body_code).toBeDefined()
    expect(attributes.delivery_body_code.type.key).toBe(DataTypes.STRING.key)

    expect(attributes.payment_preference_currency).toBeDefined()
    expect(attributes.payment_preference_currency.type.key).toBe(DataTypes.STRING.key)
  })

  test('should have correct options', () => {
    expect(etlStageAppsPaymentNotification.options.tableName).toBe('etl_stage_apps_payment_notification')
    expect(etlStageAppsPaymentNotification.options.freezeTableName).toBe(true)
    expect(etlStageAppsPaymentNotification.options.timestamps).toBe(false)
  })
})
