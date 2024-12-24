jest.mock('@azure/identity')
jest.mock('@azure/storage-blob')

const { BlobServiceClient } = require('@azure/storage-blob')
const { getFileList, downloadFile, deleteFile, getDWHExtracts, moveFile } = require('../../../app/storage')

describe('Azure Blob Storage Utilities', () => {
  let mockBlobServiceClient
  let mockContainerClient
  let mockBlockBlobClient

  beforeAll(() => {
    mockBlockBlobClient = {
      upload: jest.fn(),
      downloadToFile: jest.fn(),
      delete: jest.fn(),
      url: 'https://mockurl'
    }

    mockContainerClient = {
      getBlockBlobClient: jest.fn().mockReturnValue(mockBlockBlobClient),
      createIfNotExists: jest.fn(),
      listBlobsFlat: jest.fn().mockReturnValue({
        [Symbol.asyncIterator]: async function * () {
          yield { name: 'folder/export.csv' }
        }
      })
    }

    mockBlobServiceClient = {
      getContainerClient: jest.fn().mockReturnValue(mockContainerClient)
    }

    BlobServiceClient.fromConnectionString.mockReturnValue(mockBlobServiceClient)
    BlobServiceClient.mockImplementation(() => mockBlobServiceClient)
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should initialize containers if not initialized', async () => {
    await getFileList()
    expect(mockContainerClient.createIfNotExists).toHaveBeenCalled()
  })

  test('should get file list', async () => {
    const fileList = await getFileList()
    expect(fileList).toContain('folder/export.csv')
  })

  test('should download file', async () => {
    const tempFilePath = 'path/to/temp/file'
    await downloadFile('folder/export.csv', tempFilePath)
    expect(mockBlockBlobClient.downloadToFile).toHaveBeenCalledWith(tempFilePath)
  })

  test('should delete file', async () => {
    mockBlockBlobClient.delete.mockResolvedValue()
    const result = await deleteFile('folder/export.csv')
    expect(result).toBe(true)
    expect(mockBlockBlobClient.delete).toHaveBeenCalled()
  })

  test('should handle delete file error', async () => {
    mockBlockBlobClient.delete.mockRejectedValue(new Error('Delete error'))
    const result = await deleteFile('folder/export.csv')
    expect(result).toBe(false)
    expect(mockBlockBlobClient.delete).toHaveBeenCalled()
  })

  test('should get DWH extracts', async () => {
    const fileList = await getDWHExtracts()
    expect(fileList).toContain('folder/export.csv')
  })

  test('should move file', async () => {
    mockBlockBlobClient.beginCopyFromURL = jest.fn().mockResolvedValue({
      pollUntilDone: jest.fn().mockResolvedValue({ copyStatus: 'success' })
    })
    const result = await moveFile('sourceFolder', 'destinationFolder', 'sourceFile.csv', 'destinationFile.csv')
    expect(result).toBe(true)
    expect(mockBlockBlobClient.delete).toHaveBeenCalled()
  })

  test('should handle move file error', async () => {
    mockBlockBlobClient.beginCopyFromURL = jest.fn().mockResolvedValue({
      pollUntilDone: jest.fn().mockResolvedValue({ copyStatus: 'failed' })
    })
    const result = await moveFile('sourceFolder', 'destinationFolder', 'sourceFile.csv', 'destinationFile.csv')
    expect(result).toBe(false)
  })
})
