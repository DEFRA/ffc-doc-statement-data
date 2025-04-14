const { Readable } = require('stream')
const { getFirstLineNumber, removeFirstLine } = require('../../../app/etl/file-utils')

describe('ETL File Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getFirstLineNumber', () => {
    test('should return the first line number from the stream', async () => {
      const mockReadable = Readable.from(['42\n'])

      const result = await getFirstLineNumber(mockReadable)

      expect(result).toBe(42)
    })

    test('should handle errors', async () => {
      const mockReadable = new Readable({
        read () {
          this.emit('error', new Error('Test error'))
        }
      })

      await expect(getFirstLineNumber(mockReadable)).rejects.toThrow('Test error')
    })
  })

  describe('removeFirstLine', () => {
    test('should remove the first line from the stream', async () => {
      const inputContent = 'first line\nsecond line\nthird line\n'
      const expectedOutput = 'second line\nthird line\n'

      const mockReadable = Readable.from([inputContent])

      const resultStream = removeFirstLine(mockReadable)

      let resultData = ''
      resultStream.on('data', (chunk) => {
        resultData += chunk.toString()
      })

      await new Promise((resolve) => {
        resultStream.on('end', resolve)
      })

      expect(resultData).toBe(expectedOutput)
    })
  })
})
