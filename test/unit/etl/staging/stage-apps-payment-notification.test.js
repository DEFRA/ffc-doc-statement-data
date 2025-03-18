const { v4: uuidv4 } = require('uuid')
const storage = require('../../../../app/storage')
const { runEtlProcess } = require('../../../../app/etl/run-etl-process')
const { stageAppsPaymentNotifications } = require('../../../../app/etl/staging/stage-apps-payment-notification')
const { appsPaymentNotification } = require('../../../../app/constants/tables')
const { Readable } = require('stream')

jest.mock('uuid', () => ({ v4: jest.fn() }))
jest.mock('../../../../app/storage', () => ({
  downloadFileAsStream: jest.fn()
}))
jest.mock('../../../../app/config/storage', () => ({
  appsPaymentNotification: { folder: 'appsPaymentNotificationFolder' }
}))
jest.mock('../../../../app/constants/tables', () => ({
  appsPaymentNotificationTable: 'appsPaymentNotificationTable'
}))
jest.mock('../../../../app/etl/run-etl-process', () => ({
  runEtlProcess: jest.fn()
}))

test('stageAppsPaymentNotifications downloads file and runs ETL process', async () => {
  const mockUuid = '1234-5678-91011'
  uuidv4.mockReturnValue(mockUuid)
  const mockStreamData = 'CHANGE_TYPE,CHANGE_TIME,PKID,DT_INSERT\nINSERT,2021-01-01,1,2021-01-01\nUPDATE,2021-01-02,2,2021-01-02\n'
  const mockReadableStream = Readable.from(mockStreamData.split('\n'))
  storage.downloadFileAsStream.mockResolvedValue(mockReadableStream)

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
    { column: 'CHANGE_TYPE', targetColumn: 'changeType', targetType: 'varchar' },
    { column: 'CHANGE_TIME', targetColumn: 'changeTime', targetType: 'date', format: 'DD-MM-YYYY HH24:MI:SS' },
    { column: 'APPLICATION_ID', targetColumn: 'applicationId', targetType: 'number' },
    { column: 'ID_CLC_HEADER', targetColumn: 'idClcHeader', targetType: 'number' },
    { column: 'NOTIFICATION_DT', targetColumn: 'notificationDt', targetType: 'date', format: 'DD-MM-YYYY HH24:MI:SS' },
    { column: 'NOTIFICATION_FLAG', targetColumn: 'notificationFlag', targetType: 'varchar' },
    { column: 'NOTIFIER_KEY', targetColumn: 'notifierKey', targetType: 'number' },
    { column: 'NOTIFICATION_TEXT', targetColumn: 'notificationText', targetType: 'varchar' },
    { column: 'INVOICE_NUMBER', targetColumn: 'invoiceNumber', targetType: 'varchar' },
    { column: 'REQUEST_INVOICE_NUMBER', targetColumn: 'requestInvoiceNumber', targetType: 'varchar' },
    { column: 'PILLAR', targetColumn: 'pillar', targetType: 'varchar' },
    { column: 'DELIVERY_BODY_CODE', targetColumn: 'deliveryBodyCode', targetType: 'varchar' },
    { column: 'PAYMENT_PREFERENCE_CURRENCY', targetColumn: 'paymentPreferenceCurrency', targetType: 'varchar' }
  ]

  await stageAppsPaymentNotifications()

  expect(storage.downloadFileAsStream).toHaveBeenCalledWith('appsPaymentNotificationFolder/export.csv')
  expect(runEtlProcess).toHaveBeenCalledWith({
    fileStream: mockReadableStream,
    columns,
    table: appsPaymentNotification,
    mapping,
    file: 'appsPaymentNotificationFolder/export.csv'
  })
})
