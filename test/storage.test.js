const { BlobServiceClient } = require('@azure/storage-blob')

const storage = require('../app/storage')

let mockFiles

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
          listBlobsFlat: jest.fn().mockImplementation(() => mockFiles())
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
            yield { name: 'applicationDetailDelinked/export.csv' }
            yield { name: 'appsPaymentNotificationDelinked/export.csv' }
          })
        })
      }
    }
  }
})

jest.mock('@azure/identity')
jest.mock('../app/config/dwh', () => ({
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
  etlExtractsFolder: 'etlExtractsFolder',
  quarantineFolder: 'quarantineFolder',
  delinkedEnabled: true
}))

describe('storage module', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFiles = async function * () {
      yield { name: 'applicationDetailDelinked/export.csv' }
      yield { name: 'appsPaymentNotificationDelinked/export.csv' }
      yield { name: 'DWH_Extract_20251010_120000.zip' }
      yield { name: 'DWH_Extract_2025120000.zip' }
      yield { name: 'anotherfile.txt' }
    }
  })

  describe('BlobServiceClient initialization', () => {
    beforeEach(() => {
      jest.resetModules()
    })

    test('should use connection string for BlobServiceClient', () => {
      const { BlobServiceClient } = require('@azure/storage-blob')

      const spy = jest.spyOn(BlobServiceClient, 'fromConnectionString')

      require('../app/storage')

      expect(spy).toHaveBeenCalledWith('fake-connection-string')
    })
  })

  describe('getFileList', () => {
    test('should return list of files including delinked files', async () => {
      const fileList = await storage.getFileList()
      expect(fileList).toEqual([
        'applicationDetailDelinked/export.csv',
        'appsPaymentNotificationDelinked/export.csv'
      ])
    })
  })

  describe('getZipFile', () => {
    test('should return the name of the first zip file found', async () => {
      const zipFileName = await storage.getZipFile()
      expect(zipFileName).toBe('DWH_Extract_20251010_120000.zip')
    })
  })

  describe('quarantineAllFiles', () => {
    test('should quarantine the correct files', async () => {
      const mockMoveFile = jest.fn()
      await storage.quarantineAllFiles(mockMoveFile)
      expect(mockMoveFile).toHaveBeenCalledTimes(3)
      expect(mockMoveFile).toHaveBeenCalledWith('', 'quarantineFolder', 'DWH_Extract_20251010_120000.zip', 'DWH_Extract_20251010_120000.zip')
      expect(mockMoveFile).toHaveBeenCalledWith('applicationDetailDelinked', 'quarantineFolder', 'export.csv', 'export.csv')
      expect(mockMoveFile).toHaveBeenCalledWith('appsPaymentNotificationDelinked', 'quarantineFolder', 'export.csv', 'export.csv')
    })
  })

  describe('getBlob', () => {
    test('should return blob client', async () => {
      BlobServiceClient.prototype.getContainerClient = jest.fn().mockReturnValue({
        getBlockBlobClient: jest.fn().mockReturnValue({})
      })
      const blobClient = await storage.getBlob('filename')
      expect(blobClient).toBeDefined()
      expect(typeof blobClient).toBe('object')
    })
  })

  describe('downloadFileAsStream', () => {
    test('should download file as stream', async () => {
      const readableStreamBody = {}
      const stream = await storage.downloadFileAsStream('filename')
      expect(stream).toEqual(readableStreamBody)
    })
  })

  describe('deleteFile', () => {
    test('should delete file', async () => {
      const result = await storage.deleteFile('filename')
      expect(result).toBe(true)
    })
  })

  describe('getDWHExtracts', () => {
    test('should return list of DWH extracts', async () => {
      const fileList = await storage.getDWHExtracts()
      expect(fileList).toEqual(['applicationDetailDelinked/export.csv', 'appsPaymentNotificationDelinked/export.csv'])
    })
  })
})
