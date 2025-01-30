const fs = require('fs')
const readline = require('readline')
const { getFirstLineNumber, removeFirstLine } = require('../../../app/etl/file-utils')

jest.mock('fs')
jest.mock('readline')

fs.promises = {
  readFile: jest.fn(),
  writeFile: jest.fn(),
  unlink: jest.fn()
}

describe('ETL File Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getFirstLineNumber', () => {
    test('should return the first line number from the file', async () => {
      const filePath = 'test-file-path'
      const mockReadable = { destroy: jest.fn() }
      const mockReader = { on: jest.fn(), close: jest.fn() }

      fs.createReadStream.mockReturnValue(mockReadable)
      readline.createInterface.mockReturnValue(mockReader)

      let lineCallback
      mockReader.on.mockImplementation((event, callback) => {
        if (event === 'line') {
          lineCallback = callback
        }
      })

      const promise = getFirstLineNumber(filePath)

      lineCallback('42')

      const result = await promise

      expect(result).toBe(42)
      expect(mockReader.close).toHaveBeenCalled()
      expect(mockReadable.destroy).toHaveBeenCalled()
    })

    test('should handle errors', async () => {
      const filePath = 'test-file-path'
      const mockReadable = { destroy: jest.fn() }
      const mockReader = { on: jest.fn(), close: jest.fn() }

      fs.createReadStream.mockReturnValue(mockReadable)
      readline.createInterface.mockReturnValue(mockReader)

      let errorCallback
      mockReader.on.mockImplementation((event, callback) => {
        if (event === 'error') {
          errorCallback = callback
        }
      })

      const promise = getFirstLineNumber(filePath)

      const error = new Error('Test error')
      errorCallback(error)

      await expect(promise).rejects.toThrow('Test error')
      expect(mockReadable.destroy).toHaveBeenCalled()
    })
  })

  describe('removeFirstLine', () => {
    test('should remove the first line from the file', async () => {
      const filePath = 'test-file-path'
      const fileContent = 'first line\nsecond line\nthird line'
      const expectedContent = 'second line\nthird line'

      fs.promises.readFile.mockResolvedValue(fileContent)
      fs.promises.writeFile.mockResolvedValue()

      await removeFirstLine(filePath)

      expect(fs.promises.readFile).toHaveBeenCalledWith(filePath, 'utf8')
      expect(fs.promises.writeFile).toHaveBeenCalledWith(filePath, expectedContent)
    })
  })
})
