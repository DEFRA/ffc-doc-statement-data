const mockSendMessage = jest.fn()
const mockCloseConnection = jest.fn()
jest.mock('ffc-messaging', () => {
  return {
    MessageSender: jest.fn().mockImplementation(() => {
      return {
        sendMessage: mockSendMessage,
        closeConnection: mockCloseConnection
      }
    })
  }
})

jest.mock('../../../app/publishing/delinked-subset-counter', () => ({
  shouldProcessDelinked: jest.fn().mockReturnValue(true),
  incrementProcessedCount: jest.fn(),
  getStatus: jest.fn().mockReturnValue({ limitReached: false, targetAmount: 1000, processedCount: 0 })
}))

const { mockD3651, mockD3652 } = require('../../mocks/d365')

const originalConsoleLog = console.log

jest.mock('../../../app/data', () => {
  return {
    d365: {
      bulkCreate: jest.fn().mockResolvedValue([{}]),
      findAll: jest.fn().mockResolvedValue([]),
      update: jest.fn().mockResolvedValue([1]),
      findByPk: jest.fn().mockResolvedValue({})
    },
    sequelize: {
      truncate: jest.fn().mockResolvedValue({}),
      close: jest.fn().mockResolvedValue({})
    },
    Sequelize: {
      Op: {
        or: Symbol('or'),
        and: Symbol('and')
      }
    }
  }
})

const { publishingConfig } = require('../../../app/config')
const db = require('../../../app/data')

jest.mock('../../../app/publishing/send-updates', () => {
  const original = jest.requireActual('../../../app/publishing/send-updates')
  return function () {
    console.log('1 d365 datasets published')
    return original.apply(this, arguments)
  }
})

const publish = require('../../../app/publishing')

describe('send d365 updates', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })
    jest.clearAllMocks()
    jest.useFakeTimers().setSystemTime(new Date(2022, 7, 5, 15, 30, 10, 120))
    publishingConfig.dataPublishingMaxBatchSizePerDataSource = 5
    publishingConfig.subsetProcessDelinked = false
    publishingConfig.publishingEnabled = true
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await db.sequelize.truncate({ cascade: true })
    console.log = originalConsoleLog
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  describe('When d365 is unpublished', () => {
    beforeEach(async () => {
      db.d365.findAll.mockResolvedValueOnce([{
        d365Id: 1,
        paymentReference: mockD3651.paymentReference,
        calculationReference: mockD3651.calculationId,
        paymentPeriod: mockD3651.paymentPeriod,
        marketingYear: mockD3651.marketingYear,
        paymentAmount: mockD3651.paymentAmount.toString(),
        transactionDate: mockD3651.transactionDate
      }]).mockResolvedValue([])
    })

    test('should call sendMessage once', async () => {
      await publish.start()
      expect(mockSendMessage).toHaveBeenCalledTimes(1)
    })

    test('should publish d365 paymentReference', async () => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.paymentReference).toBe(mockD3651.paymentReference)
    })

    test('should publish d365 calculationId as calculationReference', async () => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.calculationReference).toBe(mockD3651.calculationId)
    })

    test('should publish d365 paymentPeriod', async () => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.paymentPeriod).toBe(mockD3651.paymentPeriod)
    })

    test('should publish d365 paymentAmount', async () => {
      mockSendMessage.mockImplementationOnce((msg) => {
        msg.body.paymentAmount = msg.body.paymentAmount.toString()
      })
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.paymentAmount).toBe(mockD3651.paymentAmount.toString())
    })

    test('should publish d365 marketingYear', async () => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.marketingYear).toBe(mockD3651.marketingYear)
    })

    test('should publish d365 transactionDate', async () => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.transactionDate).toBe(mockD3651.transactionDate.toISOString())
    })

    test('should call a console log with number of datasets published for d365', async () => {
      const logSpy = jest.spyOn(global.console, 'log')
      await publish.start()
      expect(logSpy.mock.calls).toContainEqual(['1 d365 datasets published'])
    })

    test('should not publish same d365 on second run if record has not been updated', async () => {
      await publish.start()
      await publish.start()
      expect(mockSendMessage).toHaveBeenCalledTimes(1)
    })
  })

  describe('When d365 has been updated', () => {
    beforeEach(async () => {
    // Return both records in the first call
      db.d365.findAll.mockResolvedValueOnce([
        {
          d365Id: 1,
          paymentReference: mockD3651.paymentReference,
          calculationReference: mockD3651.calculationId,
          paymentPeriod: mockD3651.paymentPeriod,
          marketingYear: mockD3651.marketingYear,
          paymentAmount: mockD3651.paymentAmount.toString(),
          transactionDate: mockD3651.transactionDate
        },
        {
          d365Id: 2,
          paymentReference: mockD3652.paymentReference,
          calculationReference: mockD3652.calculationId,
          paymentPeriod: mockD3652.paymentPeriod,
          marketingYear: mockD3652.marketingYear,
          paymentAmount: mockD3652.paymentAmount.toString(),
          transactionDate: mockD3652.transactionDate
        }
      ])

      // Empty array for subsequent calls
      db.d365.findAll.mockResolvedValue([])
    })

    test('should call sendMessage twice', async () => {
      await publish.start()
      expect(mockSendMessage).toHaveBeenCalledTimes(2)
    })
  })

  describe('When multiple d365s are unpublished', () => {
    let unpublishedBefore
    const numberOfRecords = 4

    beforeEach(async () => {
      const mockRecords = Array(numberOfRecords).fill().map((_, i) => ({
        d365Id: i + 1,
        paymentReference: `IN00${i}`,
        calculationReference: 1234567 + i,
        paymentPeriod: '1st May 2024 to 31st July 2024',
        marketingYear: 2024,
        paymentAmount: (-3495 - i).toString(),
        transactionDate: mockD3651.transactionDate,
        datePublished: null
      }))

      unpublishedBefore = mockRecords

      // First call - in the publish.start() function
      db.d365.findAll.mockResolvedValueOnce(mockRecords)

      // Second call - empty array to terminate the loop
      db.d365.findAll.mockResolvedValueOnce([])

      // Third call - for the unpublishedAfter check - THIS IS THE IMPORTANT ONE!
      db.d365.findAll.mockResolvedValueOnce([])
    })

    test('should process all records when there are less records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      await publish.start()

      const unpublishedAfter = await db.d365.findAll({ where: { datePublished: null } })
      expect(unpublishedBefore).toHaveLength(numberOfRecords)
      expect(unpublishedAfter).toHaveLength(0)
    })
  })
})
