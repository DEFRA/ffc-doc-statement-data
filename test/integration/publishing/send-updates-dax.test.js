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

jest.mock('../../../app/publishing/subset/update-subset-check', () => jest.fn().mockResolvedValue(true))

const { publishingConfig } = require('../../../app/config')
const db = require('../../../app/data')

const publish = require('../../../app/publishing')

const { mockDax1, mockDax2 } = require('../../mocks/dax')

describe('send dax updates', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })
    jest.clearAllMocks()
    jest.useFakeTimers().setSystemTime(new Date(2022, 7, 5, 15, 30, 10, 120))
    publishingConfig.dataPublishingMaxBatchSizePerDataSource = 5
    publishingConfig.delinked.subsetProcess = false
    publishingConfig.sfi23.subsetProcess = false
    publishingConfig.publishingEnabled = true
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await db.sequelize.truncate({ cascade: true })
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  describe('When dax is unpublished', () => {
    beforeEach(async () => {
      await db.dax.bulkCreate([mockDax1, mockDax2])
    })

    test('should call sendMessage once', async () => {
      await publish.start()
      expect(mockSendMessage).toHaveBeenCalledTimes(1)
    })

    test('should publish dax paymentReference', async () => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.paymentReference).toBe(mockDax1.paymentReference)
    })

    test('should publish dax calculationId as calculationReference', async () => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.calculationReference).toBe(mockDax1.calculationId)
    })

    test('should publish dax paymentPeriod', async () => {
      await publish.start()
      console.log(mockSendMessage.mock.calls[0][0].body)
      expect(mockSendMessage.mock.calls[0][0].body.paymentPeriod).toBe(mockDax1.paymentPeriod)
    })

    test('should publish dax paymentAmount', async () => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.paymentAmount).toBe(mockDax1.paymentAmount.toString())
    })

    test('should publish dax transactionDate', async () => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.transactionDate).toBe(mockDax1.transactionDate.toISOString())
    })

    test('should call a console log with number of datasets published for daxs', async () => {
      const logSpy = jest.spyOn(global.console, 'log')
      await publish.start()
      expect(logSpy.mock.calls).toContainEqual(['1 dax datasets published'])
    })

    test('should not publish same dax on second run if record has not been updated', async () => {
      await publish.start()
      await publish.start()
      expect(mockSendMessage).toHaveBeenCalledTimes(1)
    })
  })

  describe('When dax has been updated', () => {
    beforeEach(async () => {
      await db.dax.bulkCreate([mockDax1, mockDax2])
    })

    test('should call sendMessage twice', async () => {
      await publish.start()
      await db.dax.update({ datePublished: null }, { where: { paymentReference: mockDax2.paymentReference } })

      await publish.start()

      expect(mockSendMessage).toHaveBeenCalledTimes(2)
    })
  })

  describe('When multiple daxs are unpublished', () => {
    test('should process all records', async () => {
      const numberOfRecords = -1 + publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.dax.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockDax1, paymentReference: mockDax1.paymentReference + x } }))
      const unpublishedBefore = await db.dax.findAll({ where: { datePublished: null } })

      await publish.start()

      const unpublishedAfter = await db.dax.findAll({ where: { datePublished: null } })
      expect(unpublishedBefore).toHaveLength(numberOfRecords)
      expect(unpublishedAfter).toHaveLength(0)
    })

    test('should process all records when there are equal number of records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecords = publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.dax.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockDax1, paymentReference: mockDax1.paymentReference + x } }))
      const unpublishedBefore = await db.dax.findAll({ where: { datePublished: null } })

      await publish.start()

      const unpublishedAfter = await db.dax.findAll({ where: { datePublished: null } })
      expect(unpublishedBefore).toHaveLength(numberOfRecords)
      expect(unpublishedAfter).toHaveLength(0)
    })
  })
})
