const { BlobServiceClient } = require('@azure/storage-blob')
const {
  getFileList,
  downloadFileAsStream,
  deleteFile,
  getDWHExtracts,
  moveFile,
  getBlob,
  deleteAllETLExtracts
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
            yield { name: 'appsPaymentNotificationDelinked/export.csv' }
            yield { name: 'applicationDetailDelinked/export.csv' }
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
  sfi23Enabled: true,
  delinkedEnabled: true
}))

describe('BlobServiceClient initialization', () => {
  test('should use connection string for BlobServiceClient', () => {
    const spy = jest.spyOn(BlobServiceClient, 'fromConnectionString')
    require('../app/storage')
    expect(spy).toHaveBeenCalledWith('fake-connection-string')
  })
})

describe('getFileList', () => {
  test('should return list of files including delinked files', async () => {
    const fileList = await getFileList()
    expect(fileList).toEqual([
      'applicationDetail/export.csv',
      'appsPaymentNotification/export.csv',
      'applicationDetailDelinked/export.csv',
      'appsPaymentNotificationDelinked/export.csv'
    ])
  })
})

describe('getBlob', () => {
  test('should return blob client', async () => {
    BlobServiceClient.prototype.getContainerClient = jest.fn().mockReturnValue({
      getBlockBlobClient: jest.fn().mockReturnValue({})
    })
    const blobClient = await getBlob('filename')
    expect(blobClient).toBeDefined()
    expect(typeof blobClient).toBe('object')
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
    expect(fileList).toEqual(['applicationDetail/export.csv', 'appsPaymentNotification/export.csv', 'appsPaymentNotificationDelinked/export.csv', 'applicationDetailDelinked/export.csv'])
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

describe('deleteAllETLExtracts', () => {
  let storage
  let mockListBlobsFlat
  let mockGetBlockBlobClient
  let mockUpload
  let mockDelete

  beforeEach(() => {
    jest.resetModules()
    mockDelete = jest.fn().mockResolvedValue(true)
    mockUpload = jest.fn().mockResolvedValue(true)
    mockGetBlockBlobClient = jest.fn().mockReturnValue({ delete: mockDelete, upload: mockUpload })

    mockListBlobsFlat = jest.fn()

    jest.mock('@azure/storage-blob', () => {
      const actual = jest.requireActual('@azure/storage-blob')
      return {
        ...actual,
        BlobServiceClient: {
          fromConnectionString: jest.fn().mockReturnValue({
            getContainerClient: jest.fn().mockReturnValue({
              createIfNotExists: jest.fn(),
              getBlockBlobClient: mockGetBlockBlobClient,
              listBlobsFlat: mockListBlobsFlat
            })
          })
        }
      }
    })
    storage = require('../app/storage')
    storage.initialiseContainers = jest.fn().mockResolvedValue()
    storage.initialiseFolders = jest.fn().mockResolvedValue()
  })

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetModules()
  })

  test('should delete all ETL extract files and return true', async () => {
    mockListBlobsFlat.mockImplementation(function * ({ prefix }) {
      if (prefix === 'applicationDetail') {
        yield { name: 'applicationDetail/export.csv' }
      }
      if (prefix === 'appsPaymentNotification') {
        yield { name: 'appsPaymentNotification/export.csv' }
      }
    })

    const result = await storage.deleteAllETLExtracts()
    expect(result).toBe(true)
    expect(mockGetBlockBlobClient).toHaveBeenCalled()
    expect(mockDelete).toHaveBeenCalledTimes(2)
    expect(mockGetBlockBlobClient).toHaveBeenCalledWith('applicationDetail/export.csv')
    expect(mockGetBlockBlobClient).toHaveBeenCalledWith('appsPaymentNotification/export.csv')
  })

  test('should return true if there are no export.csv files', async () => {
    mockListBlobsFlat.mockImplementation(function * () { })

    const result = await storage.deleteAllETLExtracts()
    expect(result).toBe(true)
    expect(mockDelete).not.toHaveBeenCalled()
  })

  test('should return false if a deletion throws', async () => {
    mockListBlobsFlat.mockImplementation(function * ({ prefix }) {
      if (prefix === 'applicationDetail') {
        yield { name: 'applicationDetail/export.csv' }
      }
    })
    mockDelete.mockRejectedValueOnce(new Error('delete failed'))

    const result = await storage.deleteAllETLExtracts()
    expect(result).toBe(false)
    expect(mockDelete).toHaveBeenCalledTimes(1)
  })

  test('should successfully delete files from multiple folders', async () => {
    mockListBlobsFlat.mockImplementation(async function * () {
      yield { name: 'folder1/export.csv' }
      yield { name: 'folder2/export.csv' }
      yield { name: 'folder3/export.csv' }
    })

    const result = await deleteAllETLExtracts()
    expect(result).toBe(true)
  })
})
