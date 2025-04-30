const { BlobServiceClient } = require('@azure/storage-blob')
const {
  getFileList,
  downloadFile,
  downloadFileAsStream,
  deleteFile,
  getDWHExtracts,
  moveFile,
  getBlob
} = require('../app/storage')

jest.mock('@azure/storage-blob', () => {
  const actualModule = jest.requireActual('@azure/storage-blob')
  return {
    ...actualModule,
    BlobServiceClient: {
      fromConnectionString: jest.fn().mockImplementation(() => ({
        getContainerClient: jest.fn().mockReturnValue({
          createIfNotExists: jest.fn().mockResolvedValue(true),
          getBlockBlobClient: jest.fn().mockReturnValue({
            upload: jest.fn().mockResolvedValue(true),
            downloadToFile: jest.fn().mockResolvedValue(true),
            download: jest.fn().mockResolvedValue({ readableStreamBody: {} }),
            delete: jest.fn().mockResolvedValue(true),
            beginCopyFromURL: jest.fn().mockResolvedValue({
              pollUntilDone: jest.fn().mockResolvedValue({ copyStatus: 'success' })
            })
          }),
          listBlobsFlat: jest.fn().mockImplementation(async function * () {
            yield { name: 'applicationDetail/export.csv' }
            yield { name: 'appsPaymentNotification/export.csv' }
          })
        })
      })),
      prototype: {
        getContainerClient: jest.fn().mockReturnValue({
          createIfNotExists: jest.fn().mockResolvedValue(true),
          getBlockBlobClient: jest.fn().mockReturnValue({
            upload: jest.fn().mockResolvedValue(true),
            downloadToFile: jest.fn().mockResolvedValue(true),
            download: jest.fn().mockResolvedValue({ readableStreamBody: {} }),
            delete: jest.fn().mockResolvedValue(true),
            beginCopyFromURL: jest.fn().mockResolvedValue({
              pollUntilDone: jest.fn().mockResolvedValue({ copyStatus: 'success' })
            })
          }),
          listBlobsFlat: jest.fn().mockImplementation(async function * () {
            yield { name: 'applicationDetail/export.csv' }
            yield { name: 'appsPaymentNotification/export.csv' }
          })
        })
      }
    }
  }
})

jest.mock('@azure/identity')
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
  sfi23Enabled: true
}))

describe('BlobServiceClient initialization', () => {
  test('should use connection string for BlobServiceClient', () => {
    const spy = jest.spyOn(BlobServiceClient, 'fromConnectionString')
    require('../app/storage')
    expect(spy).toHaveBeenCalledWith('fake-connection-string')
  })
})

describe('getFileList', () => {
  test('should return list of files', async () => {
    const listBlobsFlatMock = jest.fn().mockResolvedValue([
      { name: 'applicationDetail/export.csv' },
      { name: 'appsPaymentNotification/export.csv' }
    ])
    BlobServiceClient.prototype.getContainerClient = jest.fn().mockReturnValue({
      listBlobsFlat: listBlobsFlatMock
    })
    const fileList = await getFileList()
    expect(fileList).toEqual(['applicationDetail/export.csv', 'appsPaymentNotification/export.csv'])
  })
})

describe('getBlob', () => {
  test('should return blob client', async () => {
    BlobServiceClient.prototype.getContainerClient = jest.fn().mockReturnValue({
      getBlockBlobClient: jest.fn().mockReturnValue({})
    })
    const blobClient = await getBlob('filename')
    expect(blobClient).toBeDefined() // Check that an object is returned
    expect(typeof blobClient).toBe('object') // Ensure the returned value is an object
  })
})

describe('downloadFile', () => {
  test('should download file to tempFilePath', async () => {
    const result = await downloadFile('filename', 'tempFilePath')
    expect(result).toBe(true)
  })
})

describe('downloadFileAsStream', () => {
  test('should download file as stream', async () => {
    const readableStreamBody = {}
    const stream = await downloadFileAsStream('filename')
    expect(stream).toEqual(readableStreamBody)
  })
})

describe('deleteFile', () => {
  test('should delete file', async () => {
    const result = await deleteFile('filename')
    expect(result).toBe(true)
  })
})

describe('getDWHExtracts', () => {
  test('should return list of DWH extracts', async () => {
    const fileList = await getDWHExtracts()
    expect(fileList).toEqual(['applicationDetail/export.csv', 'appsPaymentNotification/export.csv'])
  })
})

describe('moveFile', () => {
  test('should move file from source to destination', async () => {
    const sourceBlobMock = {
      url: 'source-url',
      delete: jest.fn().mockResolvedValue(true)
    }
    const destinationBlobMock = {
      beginCopyFromURL: jest.fn().mockResolvedValue({
        pollUntilDone: jest.fn().mockResolvedValue({ copyStatus: 'success' })
      })
    }
    BlobServiceClient.prototype.getContainerClient = jest.fn().mockReturnValue({
      getBlockBlobClient: jest.fn().mockReturnValueOnce(sourceBlobMock).mockReturnValueOnce(destinationBlobMock)
    })
    const result = await moveFile('sourceFolder', 'destinationFolder', 'sourceFilename', 'destinationFilename')
    expect(result).toBe(true)
  })
})
