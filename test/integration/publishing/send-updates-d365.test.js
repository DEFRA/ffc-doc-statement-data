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

const { publishingConfig } = require('../../../app/config')
const db = require('../../../app/data')

const publish = require('../../../app/publishing')

const { mockD3651, mockD3652 } = require('../../mocks/d365')

describe('send d365 updates', () => {
  beforeEach(async () => {
    await db.sequelize.truncate({ cascade: true })
    jest.clearAllMocks()
    jest.useFakeTimers().setSystemTime(new Date(2022, 7, 5, 15, 30, 10, 120))
    publishingConfig.dataPublishingMaxBatchSizePerDataSource = 5
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await db.sequelize.truncate({ cascade: true })
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  describe('When d365 is unpublished', () => {
    beforeEach(async () => {
      await db.d365.bulkCreate([mockD3651, mockD3652])
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
      console.log(mockSendMessage.mock.calls[0][0].body)
      expect(mockSendMessage.mock.calls[0][0].body.paymentPeriod).toBe(mockD3651.paymentPeriod)
    })

    test('should publish d365 paymentAmount', async () => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.paymentAmount).toBe(mockD3651.paymentAmount.toString())
    })

    test('should publish d365 transactionDate', async () => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.transactionDate).toBe(mockD3651.transactionDate.toISOString())
    })
    test('should call a console log with number of datasets published for d365s', async () => {
      const logSpy = jest.spyOn(global.console, 'log')
      await publish.start()
      expect(logSpy.mock.calls).toContainEqual(['%i %s datasets published', 1, 'd365'])
    })

    test('should not publish same d365 on second run if record has not been updated', async () => {
      await publish.start()
      await publish.start()
      expect(mockSendMessage).toHaveBeenCalledTimes(1)
    })
  })

  describe('When d365 has been updated', () => {
    beforeEach(async () => {
      await db.d365.bulkCreate([mockD3651, mockD3652])
    })

    test('should call sendMessage twice', async () => {
      await publish.start()
      await db.d365.update({ datePublished: null }, { where: { paymentReference: mockD3652.paymentReference } })

      await publish.start()

      expect(mockSendMessage).toHaveBeenCalledTimes(2)
    })
  })

  describe('When multiple d365s are unpublished', () => {
    test('should process all records when there are less records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecords = -1 + publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.d365.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockD3651, paymentReference: mockD3651.paymentReference + x } }))
      const unpublishedBefore = await db.d365.findAll({ where: { datePublished: null } })

      await publish.start()

      const unpublishedAfter = await db.d365.findAll({ where: { datePublished: null } })
      expect(unpublishedBefore).toHaveLength(numberOfRecords)
      expect(unpublishedAfter).toHaveLength(0)
    })

    test('should process all records when there are equal number of records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecords = publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.d365.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockD3651, paymentReference: mockD3651.paymentReference + x } }))
      const unpublishedBefore = await db.d365.findAll({ where: { datePublished: null } })

      await publish.start()

      const unpublishedAfter = await db.d365.findAll({ where: { datePublished: null } })
      expect(unpublishedBefore).toHaveLength(numberOfRecords)
      expect(unpublishedAfter).toHaveLength(0)
    })

    test('should process publishingConfig.dataPublishingMaxBatchSizePerDataSource records when there are more records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecords = 1 + publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.d365.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockD3651, paymentReference: mockD3651.paymentReference + x } }))
      const unpublishedBefore = await db.d365.findAll({ where: { datePublished: null } })

      await publish.start()

      const unpublishedAfter = await db.d365.findAll({ where: { datePublished: null } })
      expect(unpublishedBefore).toHaveLength(numberOfRecords)
      expect(unpublishedAfter).toHaveLength(numberOfRecords - publishingConfig.dataPublishingMaxBatchSizePerDataSource)
    })

    test('should process all records after the second publish when there are more records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecords = 1 + publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.d365.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockD3651, paymentReference: mockD3651.paymentReference + x } }))
      const unpublishedBefore = await db.d365.findAll({ where: { datePublished: null } })

      await publish.start()
      const unpublishedAfterFirstPublish = await db.d365.findAll({ where: { datePublished: null } })

      await publish.start()
      const unpublishedAfterSecondPublish = await db.d365.findAll({ where: { datePublished: null } })

      expect(unpublishedBefore).toHaveLength(numberOfRecords)
      expect(unpublishedAfterFirstPublish).toHaveLength(numberOfRecords - publishingConfig.dataPublishingMaxBatchSizePerDataSource)
      expect(unpublishedAfterSecondPublish).toHaveLength(0)
    })
  })

  describe('When there are 2 concurrent processes', () => {
    beforeEach(async () => {
      jest.useRealTimers()
    })

    test('should process all d365 records when there are 2 times the number of d365 records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecords = 2 * publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.d365.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockD3651, paymentReference: mockD3651.paymentReference + x } }))
      const unpublishedBefore = await db.d365.findAll({ where: { datePublished: null } })

      publish.start()
      publish.start()

      await new Promise(resolve => setTimeout(resolve, 1000))
      const unpublishedAfter = await db.d365.findAll({ where: { datePublished: null } })
      expect(unpublishedBefore).toHaveLength(numberOfRecords)
      expect(unpublishedAfter).toHaveLength(0)
    })

    test('should publish all d365 records when there are 2 times the number of d365 records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecords = 2 * publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.d365.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockD3651, paymentReference: mockD3651.paymentReference + x } }))

      publish.start()
      publish.start()

      await new Promise(resolve => setTimeout(resolve, 1000))
      expect(mockSendMessage).toHaveBeenCalledTimes(numberOfRecords)
    })

    test('should not process all d365 records when there are 3 times the number of d365 records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecords = 3 * publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.d365.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockD3651, paymentReference: mockD3651.paymentReference + x } }))
      const unpublishedBefore = await db.d365.findAll({ where: { datePublished: null } })

      publish.start()
      publish.start()

      await new Promise(resolve => setTimeout(resolve, 1000))
      const unpublishedAfter = await db.d365.findAll({ where: { datePublished: null } })
      expect(unpublishedBefore).toHaveLength(numberOfRecords)
      expect(unpublishedAfter).toHaveLength(publishingConfig.dataPublishingMaxBatchSizePerDataSource)
    })

    test('should not publish all d365 records when there are 3 times the number of d365 records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecords = 3 * publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.d365.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockD3651, paymentReference: mockD3651.paymentReference + x } }))

      publish.start()
      publish.start()

      await new Promise(resolve => setTimeout(resolve, 1000))
      expect(mockSendMessage).toHaveBeenCalledTimes(2 * publishingConfig.dataPublishingMaxBatchSizePerDataSource)
      expect(mockSendMessage).not.toHaveBeenCalledTimes(numberOfRecords)
    })
  })
})