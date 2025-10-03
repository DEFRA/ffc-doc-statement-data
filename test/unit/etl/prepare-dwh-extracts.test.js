const { getDWHExtracts, moveFile } = require('../../../app/storage')
const { prepareDWHExtracts } = require('../../../app/etl/prepare-dwh-extracts')
const { unzipDWHExtracts } = require('../../../app/etl/unzip-dwh-extracts')

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
  moveFile: jest.fn()
}))

jest.mock('../../../app/etl/unzip-dwh-extracts', () => ({
  unzipDWHExtracts: jest.fn()
}))

test('prepareDWHExtracts calls unzipDWHExtracts, getDWHExtracts, and moveFile with correct arguments', async () => {
  const dwhExtractsFolder = 'dwh_extracts'
  const appDetailFolder = 'Application_Detail_SFI23'
  const appDetailFile = 'SFI23_STMT_APPLICATION_DETAILS_V_CHANGE_LOG_20241227_130409.csv'
  const appPaymentFolder = 'Apps_Payment_Notification_SFI23'
  const appPaymentFile = 'SFI23_STMT_APPS_PAYMENT_NOTIFICATIONS_V_CHANGE_LOG_20241227_130800.csv'
  const mockExtracts = [`${appDetailFolder}/${appDetailFile}`, `${appPaymentFolder}/${appPaymentFile}`]

  getDWHExtracts.mockResolvedValue(mockExtracts)

  await prepareDWHExtracts()

  expect(unzipDWHExtracts).toHaveBeenCalledTimes(1)

  expect(getDWHExtracts).toHaveBeenCalled()

  expect(moveFile).toHaveBeenCalledWith(dwhExtractsFolder, appDetailFolder, `${appDetailFolder}/${appDetailFile}`, 'export.csv')
  expect(moveFile).toHaveBeenCalledWith(dwhExtractsFolder, appPaymentFolder, `${appPaymentFolder}/${appPaymentFile}`, 'export.csv')
})
