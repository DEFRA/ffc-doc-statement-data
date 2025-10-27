jest.resetModules()

const { BlobServiceClient } = require('@azure/storage-blob')

jest.mock('@azure/storage-blob', () => {
  const actualModule = jest.requireActual('@azure/storage-blob')
  return {
    ...actualModule,
    BlobServiceClient: {
      fromConnectionString: jest.fn(),
      prototype: {
        getContainerClient: jest.fn()
      }
    }
  }
})

jest.mock('../app/config/etl', () => ({
  applicationDetail: { folder: 'applicationDetail' },
  appsPaymentNotification: { folder: 'appsPaymentNotification' },
  appsTypes: { folder: 'appsTypes' },
  businessAddress: { folder: 'businessAddress' },
  calculationsDetails: { folder: 'calculationsDetails' },
  cssContractApplications: { folder: 'cssContractApplications' },
  cssContract: { folder: 'cssContract' },
  cssOptions: { folder: 'cssOptions' },
  defraLinks: { folder: 'defraLinks' },
  financeDAX: { folder: 'financeDAX' },
  organisation: { folder: 'organisation' },
  tclcOption: { folder: 'tclcOption' },
  applicationDetailDelinked: { folder: 'applicationDetailDelinked' },
  appsPaymentNotificationDelinked: { folder: 'appsPaymentNotificationDelinked' },
  appsTypesDelinked: { folder: 'appsTypesDelinked' },
  businessAddressDelinked: { folder: 'businessAddressDelinked' },
  calculationsDetailsDelinked: { folder: 'calculationsDetailsDelinked' },
  cssContractApplicationsDelinked: { folder: 'cssContractApplicationsDelinked' },
  cssContractDelinked: { folder: 'cssContractDelinked' },
  cssOptionsDelinked: { folder: 'cssOptionsDelinked' },
  day0Organisation: { folder: 'day0Organisation' },
  day0BusinessAddress: { folder: 'day0BusinessAddressContactV' },
  defraLinksDelinked: { folder: 'defraLinksDelinked' },
  financeDAXDelinked: { folder: 'financeDAXDelinked' },
  organisationDelinked: { folder: 'organisationDelinked' },
  tclcOptionDelinked: { folder: 'tclcOptionDelinked' },
  tclcDelinked: { folder: 'tclcDelinked' },
  appCalculationResultsDelinkPayments: { folder: 'appCalculationResultsDelinkPayments' },
  tdeLinkingTransferTransactions: { folder: 'tdeLinkingTransferTransactions' },
  useConnectionStr: true,
  connectionStr: 'fake-connection-string',
  storageAccount: 'fake-storage-account',
  managedIdentityClientId: 'fake-managed-identity-client-id',
  container: 'fake-container',
  createContainers: true,
  dwhExtractsFolder: 'dwhExtractsFolder',
  quarantineFolder: 'quarantineFolder',
  sfi23Enabled: true,
  delinkedEnabled: true
}))

describe('getDWHExtracts error handling', () => {
  test('should throw and log error if listBlobsFlat throws', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => { })

    const error = new Error('listBlobsFlat failure')

    const containerMock = {
      createIfNotExists: jest.fn().mockResolvedValue(true),
      listBlobsFlat: jest.fn().mockImplementation(() => {
        throw error
      }),
      getBlockBlobClient: jest.fn()
    }

    BlobServiceClient.fromConnectionString.mockImplementation(() => ({
      getContainerClient: () => containerMock
    }))

    const storageModule = require('../app/storage')

    await expect(storageModule.getDWHExtracts()).rejects.toThrow()

    consoleLogSpy.mockRestore()
  })
})
