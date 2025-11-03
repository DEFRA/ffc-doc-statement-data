// BEGIN GENERATED CODE BY ATOS POLARIS AI FOR DEVELOPMENT ON 10/27/2025, 11:02:32 AM

const { getDWHExtracts, moveFile, quarantineAllFiles, deleteFile } = require('../../../app/storage')
const { prepareDWHExtracts } = require('../../../app/etl/prepare-dwh-extracts')
const { unzipDWHExtracts } = require('../../../app/etl/unzip-dwh-extracts')
const { createAlerts } = require('../../../app/messaging/create-alerts')

jest.mock('../../../app/', () => ({
  etlConfig: {
    applicationDetail: { fileMask: 'appDetail', folder: 'appDetailFolder' },
    appsPaymentNotification: { fileMask: 'appPayment', folder: 'appPaymentFolder' },
    appsTypes: { fileMask: 'appTypes', folder: 'appTypesFolder' },
    businessAddress: { fileMask: 'businessAddr', folder: 'businessAddrFolder' },
    calculationsDetails: { fileMask: 'calcDetails', folder: 'calcDetailsFolder' },
    cssContractApplications: { fileMask: 'cssContractApp', folder: 'cssContractAppFolder' },
    cssContract: { fileMask: 'cssContract', folder: 'cssContractFolder' },
    cssOptions: { fileMask: 'cssOptions', folder: 'cssOptionsFolder' },
    defraLinks: { fileMask: 'defraLinks', folder: 'defraLinksFolder' },
    financeDAX: { fileMask: 'financeDAX', folder: 'financeDAXFolder' },
    organisation: { fileMask: 'organisation', folder: 'organisationFolder' },
    tclcOption: { fileMask: 'tclcOption', folder: 'tclcOptionFolder' },
    tclc: { fileMask: 'tclc', folder: 'tclcFolder' },
    dwhExtractsFolder: 'dwhExtractsFolder'
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
  const dwhExtractsFolder = 'dwh_extracts'
  const appDetailFolder = 'Application_Detail_SFI23'
  const appDetailFile = 'SFI23_STMT_APPLICATION_DETAILS_V_CHANGE_LOG_20241227_130409.csv'
  const appPaymentFolder = 'Apps_Payment_Notification_SFI23'
  const appPaymentFile = 'SFI23_STMT_APPS_PAYMENT_NOTIFICATIONS_V_CHANGE_LOG_20241227_130800.csv'
  const mockExtracts = [`${appDetailFolder}/${appDetailFile}`, `${appPaymentFolder}/${appPaymentFile}`]

  getDWHExtracts.mockResolvedValue(mockExtracts)
  moveFile.mockResolvedValue(true)

  await prepareDWHExtracts()

  expect(unzipDWHExtracts).toHaveBeenCalledTimes(1)

  expect(getDWHExtracts).toHaveBeenCalled()

  expect(moveFile).toHaveBeenCalledWith(dwhExtractsFolder, appDetailFolder, `${appDetailFolder}/${appDetailFile}`, 'export.csv')
  expect(moveFile).toHaveBeenCalledWith(dwhExtractsFolder, appPaymentFolder, `${appPaymentFolder}/${appPaymentFile}`, 'export.csv')
})

test('prepareDWHExtracts calls quarantineAllFiles and createAlerts on moveFile throwing error', async () => {
  const dwhExtractsFolder = 'dwh_extracts'
  const appDetailFolder = 'Application_Detail_SFI23'
  const appDetailFile = 'SFI23_STMT_APPLICATION_DETAILS_V_CHANGE_LOG_20241227_130409.csv'
  const mockExtracts = [`${appDetailFolder}/${appDetailFile}`]

  unzipDWHExtracts.mockResolvedValue()
  getDWHExtracts.mockResolvedValue(mockExtracts)
  const error = new Error('moveFile error')
  moveFile.mockRejectedValue(error)

  await prepareDWHExtracts()

  expect(unzipDWHExtracts).toHaveBeenCalled()
  expect(getDWHExtracts).toHaveBeenCalled()
  expect(moveFile).toHaveBeenCalledWith(dwhExtractsFolder, appDetailFolder, `${appDetailFolder}/${appDetailFile}`, 'export.csv')
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
  const dwhExtractsFolder = 'dwh_extracts'
  const appDetailFolder = 'Application_Detail_SFI23'
  const appDetailFile = 'SFI23_STMT_APPLICATION_DETAILS_V_CHANGE_LOG_20241227_130409.csv'
  const mockExtracts = [`${dwhExtractsFolder}/${appDetailFile}`]

  unzipDWHExtracts.mockResolvedValue()
  getDWHExtracts.mockResolvedValue(mockExtracts)

  const etlConfig = require('../../../app/').etlConfig
  etlConfig.applicationDetail.fileMask = 'appDetailFile\\.csv'
  etlConfig.applicationDetail.folder = appDetailFolder

  moveFile.mockResolvedValue(false)
  quarantineAllFiles.mockResolvedValue()
  createAlerts.mockResolvedValue()

  await prepareDWHExtracts()

  expect(unzipDWHExtracts).toHaveBeenCalled()
  expect(getDWHExtracts).toHaveBeenCalled()
  expect(moveFile).toHaveBeenCalledWith(dwhExtractsFolder, appDetailFolder, appDetailFile, 'export.csv')
  expect(quarantineAllFiles).toHaveBeenCalled()
  expect(createAlerts).toHaveBeenCalledWith({
    process: 'prepareDWHExtracts',
    message: `Failed to move file: ${appDetailFile}`
  })
})
