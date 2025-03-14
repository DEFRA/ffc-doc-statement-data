const { getDWHExtracts, moveFile } = require('../../../app/storage')
const { renameExtracts } = require('../../../app/etl/rename-extracts')

jest.mock('../../../app/', () => ({
  storageConfig: {
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

const FILE_PATH_LOOKUP = {
  appDetail: 'appDetailFolder',
  appPayment: 'appPaymentFolder',
  appTypes: 'appTypesFolder',
  businessAddr: 'businessAddrFolder',
  calcDetails: 'calcDetailsFolder',
  cssContractApp: 'cssContractAppFolder',
  cssContract: 'cssContractFolder',
  cssOptions: 'cssOptionsFolder',
  defraLinks: 'defraLinksFolder',
  financeDAX: 'financeDAXFolder',
  organisation: 'organisationFolder',
  tclcOption: 'tclcOptionFolder',
  tclc: 'tclcFolder'
}

const getOutputPathFromFileName = (fileName) => {
  let outputPath
  for (const [key, value] of Object.entries(FILE_PATH_LOOKUP)) {
    if (fileName.match(new RegExp(key))) {
      outputPath = value
      break
    }
  }
  return outputPath
}

test('getOutputPathFromFileName returns correct folder path', () => {
  expect(getOutputPathFromFileName('appDetailFile')).toBe('appDetailFolder')
  expect(getOutputPathFromFileName('appPaymentFile')).toBe('appPaymentFolder')
  expect(getOutputPathFromFileName('unknownFile')).toBeUndefined()
})

test('renameExtracts calls getDWHExtracts and moveFile with correct arguments', async () => {
  const appDetailFolder = 'Application_Detail'
  const appDetailFile = 'SFI23_STMT_APPLICATION_DETAILS_V_CHANGE_LOG_20241227_130409.csv'
  const appPaymentFolder = 'Apps_Payment_Notification'
  const appPaymentFile = 'SFI23_STMT_APPS_PAYMENT_NOTIFICATIONS_V_CHANGE_LOG_20241227_130800.csv'
  const mockExtracts = [`${appDetailFolder}/${appDetailFile}`, `${appPaymentFolder}/${appPaymentFile}`]
  getDWHExtracts.mockResolvedValue(mockExtracts)

  await renameExtracts()

  expect(getDWHExtracts).toHaveBeenCalled()
  expect(moveFile).toHaveBeenCalledWith('dwh_extracts_sfi23', appDetailFolder, `${appDetailFolder}/${appDetailFile}`, 'export.csv')
  expect(moveFile).toHaveBeenCalledWith('dwh_extracts_sfi23', appPaymentFolder, `${appPaymentFolder}/${appPaymentFile}`, 'export.csv')
})
