jest.mock('../../../app/publishing/send-message')
jest.mock('../../../app/publishing/delinked-subset-counter')
jest.mock('../../../app/publishing/validate-update', () => jest.fn().mockReturnValue(true))
jest.mock('../../../app/publishing/remove-defunct-values', () => jest.fn(record => record))

jest.mock('../../../app/publishing/get-primary-key-value', () => {
  return jest.fn((record, type) => {
    if (type === 'delinkedCalculation') return record.calculationReference
    if (type === 'organisation') return record.sbi || record.frn
    if (type === 'd365') return record.d365Id
    return undefined
  })
})

jest.mock('../../../app/config', () => ({
  env: 'test',
  dbConfig: {
    test: {
      database: 'test_db',
      username: 'postgres',
      password: 'postgres',
      host: 'localhost',
      port: 5432,
      dialect: 'postgres',
      logging: false
    }
  },
  publishingConfig: {
    publishingEnabled: true,
    dataPublishingMaxBatchSizePerDataSource: 5,
    subsetProcessDelinked: false,
    processDelinkedSubsetAmount: 10
  }
}))

jest.mock('../../../app/data/index', () => {
  return {
    sequelize: {
      transaction: jest.fn(() => ({
        commit: jest.fn().mockResolvedValue(),
        rollback: jest.fn().mockResolvedValue()
      }))
    }
  }
})

const mockGetUnpublishedDelinkedCalc = jest.fn()
const mockGetUnpublishedDelinked = jest.fn()
const mockGetUnpublishedOrg = jest.fn()
const mockGetUnpublishedD365 = jest.fn()
const mockUpdatePublishedDelinked = jest.fn()
const mockUpdatePublishedOrg = jest.fn()
const mockUpdatePublishedD365 = jest.fn()
const mockGetUnpublishedCalc = jest.fn()
const mockUpdatePublishedCalc = jest.fn()

jest.mock('../../../app/publishing/delinkedCalculation/get-unpublished-delinked', () => mockGetUnpublishedDelinkedCalc)
jest.mock('../../../app/publishing/delinkedCalculation/get-unpublished', () => mockGetUnpublishedDelinked)
jest.mock('../../../app/publishing/delinkedCalculation/update-published', () => mockUpdatePublishedDelinked)
jest.mock('../../../app/publishing/organisation/get-unpublished', () => mockGetUnpublishedOrg)
jest.mock('../../../app/publishing/organisation/update-published', () => mockUpdatePublishedOrg)
jest.mock('../../../app/publishing/d365/get-unpublished', () => mockGetUnpublishedD365)
jest.mock('../../../app/publishing/d365/update-published', () => mockUpdatePublishedD365)
jest.mock('../../../app/publishing/calculation/get-unpublished', () => mockGetUnpublishedCalc)
jest.mock('../../../app/publishing/calculation/update-published', () => mockUpdatePublishedCalc)

const sendUpdates = require('../../../app/publishing/send-updates')
const sendMessage = require('../../../app/publishing/send-message')
const delinkedSubsetCounter = require('../../../app/publishing/delinked-subset-counter')
const validateUpdate = require('../../../app/publishing/validate-update')
const { ORGANISATION, DELINKED, D365 } = require('../../../app/publishing/types')

describe('send-updates', () => {
  let consoleLogSpy
  let consoleErrorSpy

  beforeEach(() => {
    jest.clearAllMocks()

    mockGetUnpublishedDelinkedCalc.mockClear()
    mockGetUnpublishedDelinked.mockClear()
    mockGetUnpublishedOrg.mockClear()
    mockGetUnpublishedD365.mockClear()
    mockUpdatePublishedDelinked.mockClear()
    mockUpdatePublishedOrg.mockClear()
    mockUpdatePublishedD365.mockClear()
    mockGetUnpublishedCalc.mockClear()
    mockUpdatePublishedCalc.mockClear()

    mockUpdatePublishedDelinked.mockResolvedValue()
    mockUpdatePublishedOrg.mockResolvedValue()
    mockUpdatePublishedD365.mockResolvedValue()
    mockUpdatePublishedCalc.mockResolvedValue()

    const { publishingConfig } = require('../../../app/config')
    publishingConfig.publishingEnabled = true
    publishingConfig.subsetProcessDelinked = false

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    sendMessage.mockClear()
    sendMessage.mockImplementation(() => Promise.resolve())

    validateUpdate.mockClear()
    validateUpdate.mockReturnValue(true)

    delinkedSubsetCounter.getStatus.mockClear()
    delinkedSubsetCounter.shouldProcessDelinkedRecord.mockClear()
    delinkedSubsetCounter.shouldProcessDelinked.mockClear()
    delinkedSubsetCounter.establishSubsetFilter.mockClear()
    delinkedSubsetCounter.trackProcessedDelinkedRecord.mockClear()
    delinkedSubsetCounter.incrementProcessedCount.mockClear()

    delinkedSubsetCounter.getStatus.mockReturnValue({
      subsetEstablished: false,
      limitReached: false,
      processedCount: 0,
      targetAmount: 10
    })
    delinkedSubsetCounter.shouldProcessDelinkedRecord.mockReturnValue(true)
    delinkedSubsetCounter.shouldProcessDelinked.mockReturnValue(true)
    delinkedSubsetCounter.establishSubsetFilter.mockImplementation(() => Promise.resolve())
    delinkedSubsetCounter.trackProcessedDelinkedRecord.mockImplementation(() => {})
    delinkedSubsetCounter.incrementProcessedCount.mockImplementation(() => {})
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })

  describe('Normal processing (no subset filtering)', () => {
    test('should process organisation records without subset filtering', async () => {
      const mockOrganisationRecords = [
        { sbi: '123456789', name: 'Farm 1' },
        { sbi: '987654321', name: 'Farm 2' }
      ]
      mockGetUnpublishedOrg.mockResolvedValue(mockOrganisationRecords)

      await sendUpdates(ORGANISATION)

      expect(mockGetUnpublishedOrg).toHaveBeenCalledTimes(1)
      expect(sendMessage).toHaveBeenCalledTimes(2)
      expect(mockUpdatePublishedOrg).toHaveBeenCalledTimes(2)
      expect(delinkedSubsetCounter.establishSubsetFilter).not.toHaveBeenCalled()
      expect(consoleLogSpy).toHaveBeenCalledWith('2 organisation datasets published')
    })

    test('should process d365 records without subset filtering when flag is disabled', async () => {
      const mockD365Records = [
        {
          calculationReference: 'calc1',
          d365Id: 'd365-1'
        }
      ]
      mockGetUnpublishedD365.mockResolvedValue(mockD365Records)

      await sendUpdates(D365)

      expect(mockGetUnpublishedD365).toHaveBeenCalledTimes(1)
      expect(sendMessage).toHaveBeenCalledTimes(1)
      expect(mockUpdatePublishedD365).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy).toHaveBeenCalledWith('1 d365 datasets published')
    })

    test('should process delinked records without subset filtering when flag is disabled', async () => {
      const mockDelinkedRecords = [
        {
          calculationReference: 'calc1',
          sbi: '123456789'
        }
      ]
      mockGetUnpublishedDelinked.mockResolvedValue(mockDelinkedRecords)

      await sendUpdates(DELINKED)

      expect(mockGetUnpublishedDelinked).toHaveBeenCalledTimes(1)
      expect(sendMessage).toHaveBeenCalledTimes(1)
      expect(mockUpdatePublishedDelinked).toHaveBeenCalledTimes(1)
      expect(delinkedSubsetCounter.incrementProcessedCount).not.toHaveBeenCalled()
      expect(consoleLogSpy).toHaveBeenCalledWith('DELINKED scheme subset processing disabled - processing normally')
      expect(consoleLogSpy).toHaveBeenCalledWith('1 delinkedCalculation datasets published')
    })

    test('should handle no records gracefully', async () => {
      mockGetUnpublishedDelinked.mockResolvedValue([])

      await sendUpdates(DELINKED)

      expect(sendMessage).not.toHaveBeenCalled()
      expect(mockUpdatePublishedDelinked).not.toHaveBeenCalled()
      expect(consoleLogSpy).toHaveBeenCalledWith('0 delinkedCalculation datasets published')
    })

    test('should skip invalid records', async () => {
      const mockRecords = [
        { calculationReference: 'valid', sbi: '123' },
        { calculationReference: 'invalid', sbi: '456' }
      ]
      mockGetUnpublishedDelinked.mockResolvedValue(mockRecords)

      validateUpdate.mockImplementation((record) => record.calculationReference === 'valid')

      await sendUpdates(DELINKED)

      expect(sendMessage).toHaveBeenCalledTimes(1)
      expect(mockUpdatePublishedDelinked).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy).toHaveBeenCalledWith('1 delinkedCalculation datasets published')
    })

    test('should stop after first batch for calculation type', async () => {
      const mockRecords = Array(5).fill().map((_, i) => ({
        calculationId: `id-${i}`
      }))

      validateUpdate.mockReturnValue(false)

      mockGetUnpublishedCalc.mockResolvedValue(mockRecords)

      await sendUpdates('calculation')

      expect(mockGetUnpublishedCalc).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy).toHaveBeenCalledWith('0 calculation datasets published')
    })
  })

  describe('Subset processing mode', () => {
    beforeEach(() => {
      const { publishingConfig } = require('../../../app/config')
      publishingConfig.subsetProcessDelinked = true
    })

    test('should establish subset filter before processing delinked records', async () => {
      const mockDelinkedRecords = [
        { calculationReference: 'calc1', sbi: '123456789' }
      ]
      mockGetUnpublishedDelinked.mockResolvedValue(mockDelinkedRecords)

      delinkedSubsetCounter.getStatus
        .mockReturnValueOnce({
          subsetEstablished: false,
          limitReached: false,
          processedCount: 0,
          targetAmount: 10
        })
        .mockReturnValue({
          subsetEstablished: true,
          limitReached: false,
          processedCount: 0,
          targetAmount: 10
        })

      await sendUpdates(DELINKED)

      expect(delinkedSubsetCounter.establishSubsetFilter).toHaveBeenCalled()
      expect(consoleLogSpy).toHaveBeenCalledWith('Establishing subset filter before processing...')
      expect(consoleLogSpy).toHaveBeenCalledWith('Subset filter established')
    })

    test('should skip processing when limit is reached for delinked records', async () => {
      delinkedSubsetCounter.getStatus.mockReturnValue({
        subsetEstablished: true,
        limitReached: true,
        processedCount: 10,
        targetAmount: 10
      })

      await sendUpdates(DELINKED)

      expect(mockGetUnpublishedDelinked).not.toHaveBeenCalled()
      expect(sendMessage).not.toHaveBeenCalled()
      expect(consoleLogSpy).toHaveBeenCalledWith('Skipping delinkedCalculation processing - DELINKED scheme subset limit reached')
    })

    test('should only process delinked records that pass subset filtering', async () => {
      const mockDelinkedRecords = [
        { calculationReference: 'calc1', sbi: '123456789' },
        { calculationReference: 'calc2', sbi: '987654321' }
      ]
      mockGetUnpublishedDelinked.mockResolvedValue(mockDelinkedRecords)

      delinkedSubsetCounter.shouldProcessDelinkedRecord
        .mockImplementation((record) => record.calculationReference === 'calc1')

      await sendUpdates(DELINKED)

      expect(sendMessage).toHaveBeenCalledTimes(1)
      expect(sendMessage).toHaveBeenCalledWith(
        expect.objectContaining({ calculationReference: 'calc1' }),
        DELINKED
      )
      expect(delinkedSubsetCounter.trackProcessedDelinkedRecord).toHaveBeenCalledTimes(1)
      expect(delinkedSubsetCounter.incrementProcessedCount).toHaveBeenCalledTimes(1)
      expect(consoleLogSpy).toHaveBeenCalledWith('1 delinkedCalculation datasets published')
    })

    test('should process organisation records with subset filtering', async () => {
      const mockOrganisationRecords = [
        { sbi: '123456789', name: 'Farm 1' },
        { sbi: '987654321', name: 'Farm 2' }
      ]
      mockGetUnpublishedOrg.mockResolvedValue(mockOrganisationRecords)

      delinkedSubsetCounter.shouldProcessDelinkedRecord
        .mockImplementation((record) => record.sbi === '123456789')

      await sendUpdates(ORGANISATION)

      expect(delinkedSubsetCounter.establishSubsetFilter).toHaveBeenCalled()
      expect(sendMessage).toHaveBeenCalledTimes(1)
      expect(sendMessage).toHaveBeenCalledWith(
        expect.objectContaining({ sbi: '123456789' }),
        ORGANISATION
      )
      expect(consoleLogSpy).toHaveBeenCalledWith('1 organisation datasets published')
    })

    test('should stop processing when subset limit reached during batch processing', async () => {
      const batch1 = Array(5).fill().map((_, i) => ({
        calculationReference: `calc${i}`,
        sbi: `sbi${i}`
      }))

      mockGetUnpublishedDelinked
        .mockResolvedValueOnce(batch1) // First call returns 5 records
        .mockImplementation(() => {
          delinkedSubsetCounter.shouldProcessDelinked.mockReturnValue(false)
          return Promise.resolve([])
        })

      delinkedSubsetCounter.shouldProcessDelinked
        .mockReturnValueOnce(true)
        .mockReturnValue(false)

      delinkedSubsetCounter.shouldProcessDelinkedRecord.mockReturnValue(true)

      await sendUpdates(DELINKED)

      expect(mockGetUnpublishedDelinked).toHaveBeenCalledTimes(1) // Should make 1 calls
      expect(sendMessage).toHaveBeenCalledTimes(5)
      expect(delinkedSubsetCounter.incrementProcessedCount).toHaveBeenCalledTimes(5)
      expect(consoleLogSpy).toHaveBeenCalledWith('delinkedCalculation subset limit reached, stopping further processing')
    })

    test('should calculate correct batch size for delinked records based on remaining limit', async () => {
      delinkedSubsetCounter.getStatus.mockReturnValue({
        subsetEstablished: true,
        limitReached: false,
        processedCount: 7,
        targetAmount: 10
      })

      const mockDelinkedRecords = Array(3).fill().map((_, i) => ({
        calculationReference: `calc${i}`,
        sbi: `sbi${i}`
      }))

      mockGetUnpublishedDelinked.mockResolvedValue(mockDelinkedRecords)

      await sendUpdates(DELINKED)

      expect(mockGetUnpublishedDelinked).toHaveBeenCalledWith(null, 3)
      expect(sendMessage).toHaveBeenCalledTimes(3)
      expect(consoleLogSpy).toHaveBeenCalledWith('3 delinkedCalculation datasets published')
    })

    test('should handle zero effective batch size', async () => {
      delinkedSubsetCounter.getStatus.mockReturnValue({
        subsetEstablished: true,
        limitReached: true,
        processedCount: 10,
        targetAmount: 10
      })

      await sendUpdates(DELINKED)

      expect(mockGetUnpublishedDelinked).not.toHaveBeenCalled()
      expect(consoleLogSpy).toHaveBeenCalledWith('Skipping delinkedCalculation processing - DELINKED scheme subset limit reached')
    })
  })

  describe('Additional edge cases', () => {
    test('should suppress publishing when publishing is disabled', async () => {
      const { publishingConfig } = require('../../../app/config')
      publishingConfig.publishingEnabled = false

      await sendUpdates(DELINKED)
      await sendUpdates(ORGANISATION)
      await sendUpdates(D365)

      expect(mockGetUnpublishedDelinked).not.toHaveBeenCalled()
      expect(mockGetUnpublishedOrg).not.toHaveBeenCalled()
      expect(mockGetUnpublishedD365).not.toHaveBeenCalled()
      expect(sendMessage).not.toHaveBeenCalled()
      expect(consoleLogSpy).toHaveBeenCalledWith('Publishing is disabled via publishingEnabled=false flag')
    })
  })
})
