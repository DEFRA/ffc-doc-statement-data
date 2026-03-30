const { getDWHExtracts, moveFile, quarantineAllFiles, deleteFile } = require('../../../app/storage')
const { prepareDWHExtracts } = require('../../../app/etl/prepare-dwh-extracts')
const { unzipDWHExtracts } = require('../../../app/etl/unzip-dwh-extracts')
const { createAlerts } = require('../../../app/messaging/create-alerts')

jest.mock('../../../app/', () => ({
  etlConfig: {
    applicationDetailDelinked: { fileMask: 'appDetail', folder: 'appDetailFolder' },
    appsPaymentNotificationDelinked: { fileMask: 'appPayment', folder: 'appPaymentFolder' },
    etlExtractsFolder: 'delinked-payment_statements'
  }
}))

jest.mock('../../../app/storage', () => ({
  getDWHExtracts: jest.fn(),
  moveFile: jest.fn(),
  quarantineAllFiles: jest.fn(),
  deleteFile: jest.fn()
}))

jest.mock('../../../app/etl/unzip-dwh-extracts', () => ({
  unzipDWHExtracts: jest.fn()
}))

jest.mock('../../../app/messaging/create-alerts', () => ({
  createAlerts: jest.fn()
}))

test('prepareDWHExtracts calls unzipDWHExtracts, getDWHExtracts, and moveFile with correct arguments', async () => {
  const etlExtractsFolder = 'delinked-payment_statements'
  const appDetailFolder = 'Application_Detail_Delinked'
  const appDetailFile = 'DELINKED_STMT_APPLICATION_DETAILS_V_20250804_141551_v1.csv'
  const appPaymentFolder = 'Apps_Payment_Notification_Delinked'
  const appPaymentFile = 'DELINKED_STMT_APPS_PAYMENT_NOTIFICATIONS_V_20250804_141551_v1.csv'
  const mockExtracts = [`${appDetailFolder}/${appDetailFile}`, `${appPaymentFolder}/${appPaymentFile}`]

  getDWHExtracts.mockResolvedValue(mockExtracts)
  moveFile.mockResolvedValue(true)

  await prepareDWHExtracts()

  expect(unzipDWHExtracts).toHaveBeenCalledTimes(1)

  expect(getDWHExtracts).toHaveBeenCalled()

  expect(moveFile).toHaveBeenCalledWith(etlExtractsFolder, appDetailFolder, `${appDetailFolder}/${appDetailFile}`, 'export.csv')
  expect(moveFile).toHaveBeenCalledWith(etlExtractsFolder, appPaymentFolder, `${appPaymentFolder}/${appPaymentFile}`, 'export.csv')
})

test('prepareDWHExtracts calls quarantineAllFiles and createAlerts on moveFile throwing error', async () => {
  const etlExtractsFolder = 'delinked-payment_statements'
  const appDetailFolder = 'Application_Detail_Delinked'
  const appDetailFile = 'DELINKED_STMT_APPLICATION_DETAILS_V_20250804_141551_v1.csv'
  const mockExtracts = [`${appDetailFolder}/${appDetailFile}`]

  unzipDWHExtracts.mockResolvedValue()
  getDWHExtracts.mockResolvedValue(mockExtracts)
  const error = new Error('moveFile error')
  moveFile.mockRejectedValue(error)

  await prepareDWHExtracts()

  expect(unzipDWHExtracts).toHaveBeenCalled()
  expect(getDWHExtracts).toHaveBeenCalled()
  expect(moveFile).toHaveBeenCalledWith(etlExtractsFolder, appDetailFolder, `${appDetailFolder}/${appDetailFile}`, 'export.csv')
  expect(quarantineAllFiles).toHaveBeenCalled()
  expect(createAlerts).toHaveBeenCalledWith({
    process: 'prepareDWHExtracts',
    message: 'moveFile error'
  })
})

test('prepareDWHExtracts deletes file if outputFolder is undefined', async () => {
  const unknownFolder = 'unknownFolder'
  const unknownFile = 'UNKNOWN_FILE_20240101.csv'
  const mockExtracts = [`${unknownFolder}/${unknownFile}`]

  unzipDWHExtracts.mockResolvedValue()
  getDWHExtracts.mockResolvedValue(mockExtracts)
  deleteFile.mockResolvedValue()

  await prepareDWHExtracts()

  expect(unzipDWHExtracts).toHaveBeenCalled()
  expect(getDWHExtracts).toHaveBeenCalled()
  expect(deleteFile).toHaveBeenCalledWith(`${unknownFolder}/${unknownFile}`)
})

test('prepareDWHExtracts throws error and calls quarantineAllFiles and createAlerts if moveFile resolves false', async () => {
  const etlExtractsFolder = 'delinked-payment_statements'
  const appDetailFolder = 'Application_Detail_Delinked'
  const appDetailFile = 'DELINKED_STMT_APPLICATION_DETAILS_V_20250804_141551_v1.csv'
  const mockExtracts = [`${etlExtractsFolder}/${appDetailFile}`]

  unzipDWHExtracts.mockResolvedValue()
  getDWHExtracts.mockResolvedValue(mockExtracts)

  const etlConfig = require('../../../app/').etlConfig
  etlConfig.applicationDetailDelinked.fileMask = 'appDetailFile\\.csv'
  etlConfig.applicationDetailDelinked.folder = appDetailFolder

  moveFile.mockResolvedValue(false)
  quarantineAllFiles.mockResolvedValue()
  createAlerts.mockResolvedValue()

  await prepareDWHExtracts()

  expect(unzipDWHExtracts).toHaveBeenCalled()
  expect(getDWHExtracts).toHaveBeenCalled()
  expect(moveFile).toHaveBeenCalledWith(etlExtractsFolder, appDetailFolder, appDetailFile, 'export.csv')
  expect(quarantineAllFiles).toHaveBeenCalled()
  expect(createAlerts).toHaveBeenCalledWith({
    process: 'prepareDWHExtracts',
    message: `Failed to move file: ${appDetailFile}`
  })
})
