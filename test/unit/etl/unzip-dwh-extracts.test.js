const unzipper = require('unzipper')
const { unzipDWHExtracts } = require('../../../app/etl/unzip-dwh-extracts')
const { getZipFile, downloadFileAsStream, deleteFile, getBlob } = require('../../../app/storage')
const config = require('../../../app/config/etl')

jest.mock('unzipper')
jest.mock('../../../app/storage', () => ({
  getZipFile: jest.fn(),
  downloadFileAsStream: jest.fn(),
  deleteFile: jest.fn(),
  getBlob: jest.fn()
}))

describe('unzipDWHExtracts', () => {
  const mockZipFile = 'mockZipFile.zip'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should process and upload files from zip file', async () => {
    const mockDownloadStream = {
      pipe: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === 'entry') {
            const entry = {
              path: 'file.csv',
              autodrain: jest.fn()
            }
            callback(entry)
          }
          if (event === 'close') {
            callback()
          }
          return {
            on: jest.fn((event, callback) => {
              if (event === 'entry') {
                const entry = {
                  path: 'file.csv',
                  autodrain: jest.fn()
                }
                callback(entry)
              }
              if (event === 'close') {
                callback()
              }
              return {
                on: jest.fn()
              }
            })
          }
        })
      })
    }

    const mockBlobClient = {
      uploadStream: jest.fn()
    }

    getZipFile.mockResolvedValue(mockZipFile)
    downloadFileAsStream.mockResolvedValue(mockDownloadStream)
    getBlob.mockResolvedValue(mockBlobClient)

    unzipper.Parse.mockReturnValue(mockDownloadStream.pipe())

    await unzipDWHExtracts()

    expect(getZipFile).toHaveBeenCalled()
    expect(downloadFileAsStream).toHaveBeenCalledWith(mockZipFile)
    expect(getBlob).toHaveBeenCalledWith(`${config.dwhExtractsFolder}/file.csv`)
    expect(mockBlobClient.uploadStream).toHaveBeenCalledWith(expect.anything())
    expect(deleteFile).toHaveBeenCalledWith(mockZipFile)
  })

  test('should skip directories in the zip file', async () => {
    const mockDownloadStream = {
      pipe: jest.fn().mockReturnValue({
        on: jest.fn((event, callback) => {
          if (event === 'entry') {
            const entry = {
              path: 'directory/',
              autodrain: jest.fn()
            }
            callback(entry)
          }
          if (event === 'close') {
            callback()
          }
          return {
            on: jest.fn((event, callback) => {
              if (event === 'entry') {
                const entry = {
                  path: 'directory/',
                  autodrain: jest.fn()
                }
                callback(entry)
              }
              if (event === 'close') {
                callback()
              }
              return {
                on: jest.fn()
              }
            })
          }
        })
      })
    }

    getZipFile.mockResolvedValue(mockZipFile)
    downloadFileAsStream.mockResolvedValue(mockDownloadStream)

    await unzipDWHExtracts()

    expect(mockDownloadStream.pipe).toHaveBeenCalled()
  })

  test('should log when no zip file is found', async () => {
    getZipFile.mockResolvedValue(null)

    await unzipDWHExtracts()

    expect(getZipFile).toHaveBeenCalled()
    expect(downloadFileAsStream).not.toHaveBeenCalled()
    expect(deleteFile).not.toHaveBeenCalled()
  })

  test('should throw and log error if downloadFileAsStream fails', async () => {
    getZipFile.mockResolvedValue(mockZipFile)
    const error = new Error('Download stream error')
    downloadFileAsStream.mockRejectedValue(error)

    await expect(unzipDWHExtracts()).rejects.toThrow('Download stream error')

    expect(getZipFile).toHaveBeenCalled()
    expect(downloadFileAsStream).toHaveBeenCalledWith(mockZipFile)
    expect(deleteFile).not.toHaveBeenCalled()
  })
})
