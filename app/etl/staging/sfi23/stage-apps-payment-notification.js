const path = require('path')
const { v4: uuidv4 } = require('uuid')
const storage = require('../../../storage')
const storageConfig = require('../../../config/sfi23-storage')
const { appsPaymentNotificationTable } = require('../../../constants/tables')
const { runEtlProcess } = require('../../run-etl-process')

const stageAppsPaymentNotifications = async () => {
  const file = `${storageConfig.appsPaymentNotification.folder}/export.csv`
  const tempFilePath = path.join(__dirname, `appsPaymentNotifications-${uuidv4()}.csv`)
  await storage.downloadFile(file, tempFilePath)
  const columns = [
    'CHANGE_TYPE',
    'CHANGE_TIME',
    'APPLICATION_ID',
    'ID_CLC_HEADER',
    'NOTIFICATION_DT',
    'NOTIFICATION_FLAG',
    'NOTIFIER_KEY',
    'NOTIFICATION_TEXT',
    'INVOICE_NUMBER',
    'REQUEST_INVOICE_NUMBER',
    'PILLAR',
    'DELIVERY_BODY_CODE',
    'PAYMENT_PREFERENCE_CURRENCY'
  ]
  const mapping = [
    {
      column: 'CHANGE_TYPE',
      targetColumn: 'change_type',
      targetType: 'varchar'
    },
    {
      column: 'CHANGE_TIME',
      targetColumn: 'change_time',
      targetType: 'date',
      format: 'DD-MM-YYYY HH24:MI:SS'
    },
    {
      column: 'APPLICATION_ID',
      targetColumn: 'application_id',
      targetType: 'number'
    },
    {
      column: 'ID_CLC_HEADER',
      targetColumn: 'id_clc_header',
      targetType: 'number'
    },
    {
      column: 'NOTIFICATION_DT',
      targetColumn: 'notification_dt',
      targetType: 'date',
      format: 'DD-MM-YYYY HH24:MI:SS'
    },
    {
      column: 'NOTIFICATION_FLAG',
      targetColumn: 'notification_flag',
      targetType: 'varchar'
    },
    {
      column: 'NOTIFIER_KEY',
      targetColumn: 'notifier_key',
      targetType: 'number'
    },
    {
      column: 'NOTIFICATION_TEXT',
      targetColumn: 'notification_text',
      targetType: 'varchar'
    },
    {
      column: 'INVOICE_NUMBER',
      targetColumn: 'INVOICE_NUMBER',
      targetType: 'varchar'
    },
    {
      column: 'REQUEST_INVOICE_NUMBER',
      targetColumn: 'request_invoice_number',
      targetType: 'varchar'
    },
    {
      column: 'PILLAR',
      targetColumn: 'pillar',
      targetType: 'varchar'
    },
    {
      column: 'DELIVERY_BODY_CODE',
      targetColumn: 'delivery_body_code',
      targetType: 'varchar'
    },
    {
      column: 'PAYMENT_PREFERENCE_CURRENCY',
      targetColumn: 'payment_preference_currency',
      targetType: 'varchar'
    }
  ]

  return runEtlProcess({ tempFilePath, columns, table: appsPaymentNotificationTable, mapping, file })
}
module.exports = {
  stageAppsPaymentNotifications
}
