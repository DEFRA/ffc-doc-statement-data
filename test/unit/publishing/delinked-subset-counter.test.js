jest.mock('../../../app/config', () => {
  // Create a config object that can be modified by tests
  const config = {
    publishingConfig: {
      subsetProcessDelinked: true,
      processDelinkedSubsetAmount: 10
    }
  }
  return config
})

describe('delinked-subset-counter', () => {
  let counter
  let consoleLogSpy
  let publishingConfig

  beforeEach(() => {
    // Clear mock state
    jest.clearAllMocks()
    jest.resetModules()

    // Get fresh config reference
    const config = require('../../../app/config')
    publishingConfig = config.publishingConfig

    // Reset config to default values for each test
    publishingConfig.subsetProcessDelinked = true
    publishingConfig.processDelinkedSubsetAmount = 10

    // Get a fresh copy of the counter module
    counter = require('../../../app/publishing/delinked-subset-counter')

    // Reset counter state
    counter.resetCounter()

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
  })

  describe('shouldProcessDelinked', () => {
    test('should return true when subsetProcessDelinked is false', () => {
      jest.resetModules()
      const config = require('../../../app/config')
      config.publishingConfig.subsetProcessDelinked = false
      counter = require('../../../app/publishing/delinked-subset-counter')

      const result = counter.shouldProcessDelinked()

      expect(result).toBe(true)
    })

    test('should return true when subset processing is enabled and count is below limit', () => {
      jest.resetModules()
      const config = require('../../../app/config')
      config.publishingConfig.subsetProcessDelinked = true
      config.publishingConfig.processDelinkedSubsetAmount = 10
      counter = require('../../../app/publishing/delinked-subset-counter')

      const result = counter.shouldProcessDelinked()

      expect(result).toBe(true)
    })

    test('should return false when subset processing is enabled and count reaches limit', () => {
      jest.resetModules()
      const config = require('../../../app/config')
      config.publishingConfig.subsetProcessDelinked = true
      config.publishingConfig.processDelinkedSubsetAmount = 5
      counter = require('../../../app/publishing/delinked-subset-counter')

      // Process up to the limit
      for (let i = 0; i < 5; i++) {
        counter.incrementProcessedCount(1)
      }

      const result = counter.shouldProcessDelinked()

      expect(result).toBe(false)
    })

    test('should return false when subset processing is enabled and count exceeds limit', () => {
      jest.resetModules()
      const config = require('../../../app/config')
      config.publishingConfig.subsetProcessDelinked = true
      config.publishingConfig.processDelinkedSubsetAmount = 3
      counter = require('../../../app/publishing/delinked-subset-counter')

      // Process beyond the limit
      counter.incrementProcessedCount(5)

      const result = counter.shouldProcessDelinked()

      expect(result).toBe(false)
    })
  })

  describe('incrementProcessedCount', () => {
    test('should not increment when subsetProcessDelinked is false', () => {
      jest.resetModules()
      const config = require('../../../app/config')
      config.publishingConfig.subsetProcessDelinked = false
      counter = require('../../../app/publishing/delinked-subset-counter')

      counter.incrementProcessedCount(5)

      const status = counter.getStatus()
      expect(status.processedCount).toBe(0)
      expect(consoleLogSpy).not.toHaveBeenCalled()
    })

    test('should increment count by 1 when no parameter provided', () => {
      jest.resetModules()
      const config = require('../../../app/config')
      config.publishingConfig.subsetProcessDelinked = true
      config.publishingConfig.processDelinkedSubsetAmount = 10
      counter = require('../../../app/publishing/delinked-subset-counter')

      counter.incrementProcessedCount()

      const status = counter.getStatus()
      expect(status.processedCount).toBe(1)
      expect(consoleLogSpy).toHaveBeenCalledWith('Delinked subset processing: 1/10 processed')
    })

    test('should increment count by specified amount', () => {
      jest.resetModules()
      const config = require('../../../app/config')
      config.publishingConfig.subsetProcessDelinked = true
      config.publishingConfig.processDelinkedSubsetAmount = 10
      counter = require('../../../app/publishing/delinked-subset-counter')

      counter.incrementProcessedCount(3)

      const status = counter.getStatus()
      expect(status.processedCount).toBe(3)
      expect(consoleLogSpy).toHaveBeenCalledWith('Delinked subset processing: 3/10 processed')
    })

    test('should log limit reached message when count reaches target', () => {
      jest.resetModules()
      const config = require('../../../app/config')
      config.publishingConfig.subsetProcessDelinked = true
      config.publishingConfig.processDelinkedSubsetAmount = 5
      counter = require('../../../app/publishing/delinked-subset-counter')

      counter.incrementProcessedCount(5)

      expect(consoleLogSpy).toHaveBeenCalledWith('Delinked subset processing: 5/5 processed')
      expect(consoleLogSpy).toHaveBeenCalledWith('Delinked subset limit reached, disabling further processing')
    })

    test('should log limit reached message when count exceeds target', () => {
      jest.resetModules()
      const config = require('../../../app/config')
      config.publishingConfig.subsetProcessDelinked = true
      config.publishingConfig.processDelinkedSubsetAmount = 3
      counter = require('../../../app/publishing/delinked-subset-counter')

      counter.incrementProcessedCount(5)

      expect(consoleLogSpy).toHaveBeenCalledWith('Delinked subset processing: 5/3 processed')
      expect(consoleLogSpy).toHaveBeenCalledWith('Delinked subset limit reached, disabling further processing')
    })

    test('should accumulate multiple increments correctly', () => {
      jest.resetModules()
      const config = require('../../../app/config')
      config.publishingConfig.subsetProcessDelinked = true
      config.publishingConfig.processDelinkedSubsetAmount = 10
      counter = require('../../../app/publishing/delinked-subset-counter')

      counter.incrementProcessedCount(3)
      counter.incrementProcessedCount(2)
      counter.incrementProcessedCount(1)

      const status = counter.getStatus()
      expect(status.processedCount).toBe(6)
      expect(consoleLogSpy).toHaveBeenCalledTimes(3)
      expect(consoleLogSpy).toHaveBeenNthCalledWith(1, 'Delinked subset processing: 3/10 processed')
      expect(consoleLogSpy).toHaveBeenNthCalledWith(2, 'Delinked subset processing: 5/10 processed')
      expect(consoleLogSpy).toHaveBeenNthCalledWith(3, 'Delinked subset processing: 6/10 processed')
    })
  })

  describe('getStatus', () => {
    test('should return correct status when subset processing is disabled', () => {
      jest.resetModules()
      const config = require('../../../app/config')
      config.publishingConfig.subsetProcessDelinked = false
      config.publishingConfig.processDelinkedSubsetAmount = 10
      counter = require('../../../app/publishing/delinked-subset-counter')

      const status = counter.getStatus()

      expect(status).toEqual({
        subsetProcessingEnabled: false,
        processedCount: 0,
        targetAmount: 10,
        limitReached: false,
        canProcessMore: true
      })
    })

    test('should return correct status when subset processing is enabled and no items processed', () => {
      jest.resetModules()
      const config = require('../../../app/config')
      config.publishingConfig.subsetProcessDelinked = true
      config.publishingConfig.processDelinkedSubsetAmount = 5
      counter = require('../../../app/publishing/delinked-subset-counter')

      const status = counter.getStatus()

      expect(status).toEqual({
        subsetProcessingEnabled: true,
        processedCount: 0,
        targetAmount: 5,
        limitReached: false,
        canProcessMore: true
      })
    })

    test('should return correct status when subset processing is enabled and some items processed', () => {
      jest.resetModules()
      const config = require('../../../app/config')
      config.publishingConfig.subsetProcessDelinked = true
      config.publishingConfig.processDelinkedSubsetAmount = 10
      counter = require('../../../app/publishing/delinked-subset-counter')

      counter.incrementProcessedCount(3)

      const status = counter.getStatus()

      expect(status).toEqual({
        subsetProcessingEnabled: true,
        processedCount: 3,
        targetAmount: 10,
        limitReached: false,
        canProcessMore: true
      })
    })

    test('should return correct status when subset processing is enabled and limit reached', () => {
      jest.resetModules()
      const config = require('../../../app/config')
      config.publishingConfig.subsetProcessDelinked = true
      config.publishingConfig.processDelinkedSubsetAmount = 5
      counter = require('../../../app/publishing/delinked-subset-counter')

      counter.incrementProcessedCount(5)

      const status = counter.getStatus()

      expect(status).toEqual({
        subsetProcessingEnabled: true,
        processedCount: 5,
        targetAmount: 5,
        limitReached: true,
        canProcessMore: false
      })
    })

    test('should return correct status when subset processing is enabled and limit exceeded', () => {
      jest.resetModules()
      const config = require('../../../app/config')
      config.publishingConfig.subsetProcessDelinked = true
      config.publishingConfig.processDelinkedSubsetAmount = 3
      counter = require('../../../app/publishing/delinked-subset-counter')

      counter.incrementProcessedCount(7)

      const status = counter.getStatus()

      expect(status).toEqual({
        subsetProcessingEnabled: true,
        processedCount: 7,
        targetAmount: 3,
        limitReached: true,
        canProcessMore: false
      })
    })

    test('should maintain state consistency across multiple operations', () => {
      jest.resetModules()
      const config = require('../../../app/config')
      config.publishingConfig.subsetProcessDelinked = true
      config.publishingConfig.processDelinkedSubsetAmount = 8
      counter = require('../../../app/publishing/delinked-subset-counter')

      // Initial state
      let status = counter.getStatus()
      expect(status.canProcessMore).toBe(true)
      expect(status.limitReached).toBe(false)

      // Process some items
      counter.incrementProcessedCount(4)
      status = counter.getStatus()
      expect(status.processedCount).toBe(4)
      expect(status.canProcessMore).toBe(true)
      expect(status.limitReached).toBe(false)

      // Reach the limit
      counter.incrementProcessedCount(4)
      status = counter.getStatus()
      expect(status.processedCount).toBe(8)
      expect(status.canProcessMore).toBe(false)
      expect(status.limitReached).toBe(true)
    })
  })

  describe('edge cases', () => {
    test('should handle zero target amount', () => {
      jest.resetModules()
      const config = require('../../../app/config')
      config.publishingConfig.subsetProcessDelinked = true
      config.publishingConfig.processDelinkedSubsetAmount = 0
      counter = require('../../../app/publishing/delinked-subset-counter')

      const status = counter.getStatus()
      expect(status.limitReached).toBe(true)
      expect(status.canProcessMore).toBe(false)
    })

    test('should handle negative increment (edge case)', () => {
      jest.resetModules()
      const config = require('../../../app/config')
      config.publishingConfig.subsetProcessDelinked = true
      config.publishingConfig.processDelinkedSubsetAmount = 5
      counter = require('../../../app/publishing/delinked-subset-counter')

      counter.incrementProcessedCount(3)
      counter.incrementProcessedCount(-1) // This shouldn't happen in normal use but test edge case

      const status = counter.getStatus()
      expect(status.processedCount).toBe(2)
    })

    test('should handle very large increment', () => {
      jest.resetModules()
      const config = require('../../../app/config')
      config.publishingConfig.subsetProcessDelinked = true
      config.publishingConfig.processDelinkedSubsetAmount = 5
      counter = require('../../../app/publishing/delinked-subset-counter')

      counter.incrementProcessedCount(1000)

      const status = counter.getStatus()
      expect(status.processedCount).toBe(1000)
      expect(status.limitReached).toBe(true)
      expect(consoleLogSpy).toHaveBeenCalledWith('Delinked subset limit reached, disabling further processing')
    })
  })
})
