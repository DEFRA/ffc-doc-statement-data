const sourceColumnNames = require('../../constants/source-column-names')
const targetColumnNames = require('../../constants/target-column-names')
const { appsPaymentNotification } = require('../../constants/tables')
const { VARCHAR, DATE, NUMBER } = require('../../constants/target-column-types')
const { downloadAndProcessFile, dateTimeFormat } = require('./stage-utils')

const stageAppsPaymentNotifications = async () => {
  const columns = [
    sourceColumnNames.CHANGE_TYPE,
    sourceColumnNames.CHANGE_TIME,
    sourceColumnNames.APPLICATION_ID,
    sourceColumnNames.ID_CLC_HEADER,
    sourceColumnNames.NOTIFICATION_DT,
    sourceColumnNames.NOTIFICATION_FLAG,
    sourceColumnNames.NOTIFIER_KEY,
    sourceColumnNames.NOTIFICATION_TEXT,
    sourceColumnNames.INVOICE_NUMBER,
    sourceColumnNames.REQUEST_INVOICE_NUMBER,
    sourceColumnNames.PILLAR,
    sourceColumnNames.DELIVERY_BODY_CODE,
    sourceColumnNames.PAYMENT_PREFERENCE_CURRENCY
  ]

  const mapping = [
    { column: sourceColumnNames.CHANGE_TYPE, targetColumn: targetColumnNames.changeType, targetType: VARCHAR },
    { column: sourceColumnNames.CHANGE_TIME, targetColumn: targetColumnNames.changeTime, targetType: DATE, format: dateTimeFormat },
    { column: sourceColumnNames.APPLICATION_ID, targetColumn: targetColumnNames.applicationId, targetType: NUMBER },
    { column: sourceColumnNames.ID_CLC_HEADER, targetColumn: targetColumnNames.idClcHeader, targetType: NUMBER },
    { column: sourceColumnNames.NOTIFICATION_DT, targetColumn: targetColumnNames.notificationDt, targetType: DATE, format: dateTimeFormat },
    { column: sourceColumnNames.NOTIFICATION_FLAG, targetColumn: targetColumnNames.notificationFlag, targetType: VARCHAR },
    { column: sourceColumnNames.NOTIFIER_KEY, targetColumn: targetColumnNames.notifierKey, targetType: NUMBER },
    { column: sourceColumnNames.NOTIFICATION_TEXT, targetColumn: targetColumnNames.notificationText, targetType: VARCHAR },
    { column: sourceColumnNames.INVOICE_NUMBER, targetColumn: targetColumnNames.invoiceNumber, targetType: VARCHAR },
    { column: sourceColumnNames.REQUEST_INVOICE_NUMBER, targetColumn: targetColumnNames.requestInvoiceNumber, targetType: VARCHAR },
    { column: sourceColumnNames.PILLAR, targetColumn: targetColumnNames.pillar, targetType: VARCHAR },
    { column: sourceColumnNames.DELIVERY_BODY_CODE, targetColumn: targetColumnNames.deliveryBodyCode, targetType: VARCHAR },
    { column: sourceColumnNames.PAYMENT_PREFERENCE_CURRENCY, targetColumn: targetColumnNames.paymentPreferenceCurrency, targetType: VARCHAR }
  ]

  return downloadAndProcessFile('appsPaymentNotification', appsPaymentNotification, columns, mapping)
}

module.exports = {
  stageAppsPaymentNotifications
}
