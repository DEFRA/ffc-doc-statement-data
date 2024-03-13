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

const { mockTotal1, mockTotal3 } = require('../../mocks/totals')
const { mockAction1, mockAction3 } = require('../../mocks/actions')

describe('send total updates', () => {
  beforeEach(async () => {
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

  describe('When total is unpublished', () => {
    beforeEach(async () => {
      await db.total.create(mockTotal1)
      await db.action.create(mockAction1)
    })

    test('should call sendMessage once', async () => {
      await publish()
      expect(mockSendMessage).toHaveBeenCalledTimes(1)
    })

    test('should publish total calculation reference', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.calculationReference).toBe(mockTotal1.calculationId)
    })

    test('should publish total sbi', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.sbi).toBe(mockTotal1.sbi)
    })

    test('should publish total frn', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.frn).toBe(mockTotal1.frn.toString())
    })

    test('should publish total agreement number', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.agreementNumber).toBe(mockTotal1.agreementNumber)
    })

    test('should publish total claimReference number', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.claimReference).toBe(mockTotal1.claimId)
    })

    test('should publish total scheme type', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.schemeType).toBe(mockTotal1.schemeType)
    })

    test('should publish invoice number', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.invoiceNumber).toBe(mockTotal1.invoiceNumber)
    })

    test('should publish calculation date', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.calculationDate).toBe(mockTotal1.calculationDate.toISOString())
    })

    test('should publish agreement start date', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.agreementStart).toBe(mockTotal1.agreementStart.toISOString())
    })

    test('should publish agreement end date', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.agreementEnd).toBe(mockTotal1.agreementEnd.toISOString())
    })

    test('should publish totalAdditionalPayments', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.totalAdditionalPayments).toBe(mockTotal1.totalAdditionalPayments.toFixed(2).toString())
    })

    test('should publish totalActionPayments', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.totalActionPayments).toBe(mockTotal1.totalActionPayments.toFixed(2).toString())
    })

    test('should publish totalPayments', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.totalPayments).toBe(mockTotal1.totalPayments.toFixed(2).toString())
    })

    test('should publish total updated date', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.updated).toBe(mockTotal1.updated.toISOString())
    })

    test('should publish action', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.actions.length).toBe(1)
    })

    test('should publish action rate', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.actions[0].rate).toBe(mockAction1.rate)
    })

    test('should publish action fundingCode', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.actions[0].fundingCode).toBe(mockAction1.fundingCode)
    })

    test('should publish action land area', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.actions[0].landArea).toBe(mockAction1.landArea.toFixed(6))
    })

    test('should not publish action actionReference', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.actions[0].actionReference).toBe(mockAction1.actionId)
    })

    test('should not publish action calculationReference', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.actions[0].calculationReference).toBe(mockAction1.calculationId)
    })

    test('should not publish action groupName', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.actions[0].groupName).toBe(mockAction1.groupName)
    })

    test('should not publish action actionCode', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.actions[0].actionCode).toBe(mockAction1.actionCode)
    })

    test('should not publish action actionName', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.actions[0].actionName).toBe(mockAction1.actionName)
    })

    test('should not publish action primary key', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.actions[0].actionId).toBeUndefined()
    })

    test('should publish total type', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.type).toBe('total')
    })

    test('should not publish null published value', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.published).toBeUndefined()
    })

    test('should update published date', async () => {
      await publish()
      const total = await db.total.findByPk(mockTotal1.calculationId)
      expect(total.datePublished).toStrictEqual(new Date(2022, 7, 5, 15, 30, 10, 120))
    })

    test('should call a console log with number of datasets published for total', async () => {
      const logSpy = jest.spyOn(global.console, 'log')
      await publish()
      expect(logSpy.mock.calls).toContainEqual(['%i %s datasets published', 1, 'total'])
    })

    test('should not publish same total on second run if record has not been updated', async () => {
      await publish()
      await publish()

      expect(mockSendMessage).toHaveBeenCalledTimes(1)
    })
  })

  describe('When total is unpublished and has multiple actions', () => {
    beforeEach(async () => {
      await db.total.bulkCreate([mockTotal1, mockTotal3])
      await db.action.bulkCreate([mockAction1, mockAction3])
    })

    test('should publish all action options', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.actions.length).toBe(2)
    })
  })

  describe('When total has been updated', () => {
    beforeEach(async () => {
      await db.total.create(mockTotal1)
      await db.action.create(mockAction1)
    })

    test('should call sendMessage twice', async () => {
      await publish()
      await db.total.update({ updated: new Date(2022, 8, 5, 15, 30, 10, 121) }, { where: { calculationId: 1234567 } })

      await publish()

      expect(mockSendMessage).toHaveBeenCalledTimes(2)
    })
  })

  describe('When multiple calculations are unpublished', () => {
    test('should process all records when there are less records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecords = -1 + publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.total.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockTotal1, calculationId: mockTotal1.calculationId + x } }))
      await db.action.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockAction1, actionId: mockAction1.actionId + x, calculationId: mockTotal1.calculationId + x } }))
      const unpublishedBefore = await db.total.findAll({ where: { datePublished: null } })

      await publish()

      const unpublishedAfter = await db.total.findAll({ where: { datePublished: null } })
      expect(unpublishedBefore).toHaveLength(numberOfRecords)
      expect(unpublishedAfter).toHaveLength(0)
    })

    test('should publish all records when there are less records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecords = -1 + publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.total.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockTotal1, calculationId: mockTotal1.calculationId + x } }))
      await db.action.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockAction1, actionId: mockAction1.actionId + x, calculationId: mockTotal1.calculationId + x } }))

      await publish()

      expect(mockSendMessage).toHaveBeenCalledTimes(numberOfRecords)
    })

    test('should process all records when there are equal number of records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecords = publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.total.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockTotal1, calculationId: mockTotal1.calculationId + x } }))
      await db.action.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockAction1, actionId: mockAction1.actionId + x, calculationId: mockTotal1.calculationId + x } }))
      const unpublishedBefore = await db.total.findAll({ where: { datePublished: null } })

      await publish()

      const unpublishedAfter = await db.total.findAll({ where: { datePublished: null } })
      expect(unpublishedBefore).toHaveLength(numberOfRecords)
      expect(unpublishedAfter).toHaveLength(0)
    })

    test('should publish all records when there are equal number of records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecords = publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.total.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockTotal1, calculationId: mockTotal1.calculationId + x } }))
      await db.action.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockAction1, actionId: mockAction1.actionId + x, calculationId: mockTotal1.calculationId + x } }))

      await publish()

      expect(mockSendMessage).toHaveBeenCalledTimes(numberOfRecords)
    })

    test('should process publishingConfig.dataPublishingMaxBatchSizePerDataSource records when there are more records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecords = 1 + publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.total.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockTotal1, calculationId: mockTotal1.calculationId + x } }))
      await db.action.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockAction1, actionId: mockAction1.actionId + x, calculationId: mockTotal1.calculationId + x } }))
      const unpublishedBefore = await db.total.findAll({ where: { datePublished: null } })

      await publish()

      const unpublishedAfter = await db.total.findAll({ where: { datePublished: null } })
      expect(unpublishedBefore).toHaveLength(numberOfRecords)
      expect(unpublishedAfter).toHaveLength(numberOfRecords - publishingConfig.dataPublishingMaxBatchSizePerDataSource)
    })

    test('should publish publishingConfig.dataPublishingMaxBatchSizePerDataSource records when there are equal number of records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecords = 1 + publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.total.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockTotal1, calculationId: mockTotal1.calculationId + x } }))
      await db.action.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockAction1, actionId: mockAction1.actionId + x, calculationId: mockTotal1.calculationId + x } }))

      await publish()

      expect(mockSendMessage).toHaveBeenCalledTimes(publishingConfig.dataPublishingMaxBatchSizePerDataSource)
    })

    test('should process all records after the second publish when there are more records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecords = 1 + publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.total.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockTotal1, calculationId: mockTotal1.calculationId + x } }))
      await db.action.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockAction1, actionId: mockAction1.actionId + x, calculationId: mockTotal1.calculationId + x } }))
      const unpublishedBefore = await db.total.findAll({ where: { datePublished: null } })

      await publish()
      const unpublishedAfterFirstPublish = await db.total.findAll({ where: { datePublished: null } })

      await publish()
      const unpublishedAfterSecondPublish = await db.total.findAll({ where: { datePublished: null } })

      expect(unpublishedBefore).toHaveLength(numberOfRecords)
      expect(unpublishedAfterFirstPublish).toHaveLength(numberOfRecords - publishingConfig.dataPublishingMaxBatchSizePerDataSource)
      expect(unpublishedAfterSecondPublish).toHaveLength(0)
    })

    test('should publish all records after the second publish when there are less records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecords = 1 + publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.total.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockTotal1, calculationId: mockTotal1.calculationId + x } }))
      await db.action.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockAction1, actionId: mockAction1.actionId + x, calculationId: mockTotal1.calculationId + x } }))

      await publish()
      await publish()

      expect(mockSendMessage).toHaveBeenCalledTimes(numberOfRecords)
    })
  })

  describe('When multiple actions are attached to unpublished calculations', () => {
    test('should process total record when there are less funding records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecordsCalculation = 1
      const numberOfRecordsFunding = -1 + publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.total.create(mockTotal1)
      await db.action.bulkCreate([...Array(numberOfRecordsFunding).keys()].map(x => { return { ...mockAction1, actionId: mockAction1.actionId + x, calculationId: mockTotal1.calculationId } }))
      const unpublishedBefore = await db.total.findAll({ where: { datePublished: null } })

      await publish()

      const unpublishedAfter = await db.total.findAll({ where: { datePublished: null } })
      expect(unpublishedBefore).toHaveLength(numberOfRecordsCalculation)
      expect(unpublishedAfter).toHaveLength(0)
    })

    test('should publish total record when there are less funding records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecordsCalculation = 1
      const numberOfRecordsFunding = -1 + publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.total.create(mockTotal1)
      await db.action.bulkCreate([...Array(numberOfRecordsFunding).keys()].map(x => { return { ...mockAction1, actionId: mockAction1.actionId + x, calculationId: mockTotal1.calculationId } }))

      await publish()

      expect(mockSendMessage).toHaveBeenCalledTimes(numberOfRecordsCalculation)
      expect(mockSendMessage).not.toHaveBeenCalledTimes(numberOfRecordsFunding)
    })

    test('should publish all funding records when there are less funding records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecordsFunding = -1 + publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.total.create(mockTotal1)
      await db.action.bulkCreate([...Array(numberOfRecordsFunding).keys()].map(x => { return { ...mockAction1, actionId: mockAction1.actionId + x, calculationId: mockTotal1.calculationId } }))

      await publish()

      expect(mockSendMessage.mock.calls[0][0].body.actions).toHaveLength(numberOfRecordsFunding)
    })

    test('should process total record when there are equal number of funding records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecordsCalculation = 1
      const numberOfRecordsFunding = publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.total.create(mockTotal1)
      await db.action.bulkCreate([...Array(numberOfRecordsFunding).keys()].map(x => { return { ...mockAction1, actionId: mockAction1.actionId + x, calculationId: mockTotal1.calculationId } }))
      const unpublishedBefore = await db.total.findAll({ where: { datePublished: null } })

      await publish()

      const unpublishedAfter = await db.total.findAll({ where: { datePublished: null } })
      expect(unpublishedBefore).toHaveLength(numberOfRecordsCalculation)
      expect(unpublishedAfter).toHaveLength(0)
    })

    test('should publish total record when there are equal number of funding records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecordsCalculation = 1
      const numberOfRecordsFunding = publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.total.create(mockTotal1)
      await db.action.bulkCreate([...Array(numberOfRecordsFunding).keys()].map(x => { return { ...mockAction1, actionId: mockAction1.actionId + x, calculationId: mockTotal1.calculationId } }))

      await publish()

      expect(mockSendMessage).toHaveBeenCalledTimes(numberOfRecordsCalculation)
      expect(mockSendMessage).not.toHaveBeenCalledTimes(numberOfRecordsFunding)
    })

    test('should publish all funding records when there are equal number of funding records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecordsFunding = publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.total.create(mockTotal1)
      await db.action.bulkCreate([...Array(numberOfRecordsFunding).keys()].map(x => { return { ...mockAction1, actionId: mockAction1.actionId + x, calculationId: mockTotal1.calculationId } }))

      await publish()

      expect(mockSendMessage.mock.calls[0][0].body.actions).toHaveLength(numberOfRecordsFunding)
    })

    test('should process total record when there are more funding records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecordsCalculation = 1
      const numberOfRecordsFunding = 1 + publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.total.create(mockTotal1)
      await db.action.bulkCreate([...Array(numberOfRecordsFunding).keys()].map(x => { return { ...mockAction1, actionId: mockAction1.actionId + x, calculationId: mockTotal1.calculationId } }))
      const unpublishedBefore = await db.total.findAll({ where: { datePublished: null } })

      await publish()

      const unpublishedAfter = await db.total.findAll({ where: { datePublished: null } })
      expect(unpublishedBefore).toHaveLength(numberOfRecordsCalculation)
      expect(unpublishedAfter).toHaveLength(0)
    })

    test('should publish total record when there are more funding records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecordsCalculation = 1
      const numberOfRecordsFunding = 1 + publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.total.create(mockTotal1)
      await db.action.bulkCreate([...Array(numberOfRecordsFunding).keys()].map(x => { return { ...mockAction1, actionId: mockAction1.actionId + x, calculationId: mockTotal1.calculationId } }))

      await publish()

      expect(mockSendMessage).toHaveBeenCalledTimes(numberOfRecordsCalculation)
      expect(mockSendMessage).not.toHaveBeenCalledTimes(numberOfRecordsFunding)
    })

    test('should publish all funding records when there are more funding records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecordsFunding = 1 + publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.total.create(mockTotal1)
      await db.action.bulkCreate([...Array(numberOfRecordsFunding).keys()].map(x => { return { ...mockAction1, actionId: mockAction1.actionId + x, calculationId: mockTotal1.calculationId } }))

      await publish()

      expect(mockSendMessage.mock.calls[0][0].body.actions).toHaveLength(numberOfRecordsFunding)
      expect(mockSendMessage.mock.calls[0][0].body.actions).not.toHaveLength(publishingConfig.dataPublishingMaxBatchSizePerDataSource)
    })
  })

  describe('When there are 2 concurrent processes', () => {
    beforeEach(async () => {
      jest.useRealTimers()
    })

    test('should process all total records when there are 2 times the number of total records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecords = 2 * publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.total.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockTotal1, calculationId: mockTotal1.calculationId + x } }))
      await db.action.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockAction1, actionId: mockAction1.actionId + x, calculationId: mockTotal1.calculationId + x } }))
      const unpublishedBefore = await db.total.findAll({ where: { datePublished: null } })

      publish()
      publish()

      await new Promise(resolve => setTimeout(resolve, 1000))
      const unpublishedAfter = await db.total.findAll({ where: { datePublished: null } })
      expect(unpublishedBefore).toHaveLength(numberOfRecords)
      expect(unpublishedAfter).toHaveLength(0)
    })

    test('should publish all total records when there are 2 times the number of total records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecords = 2 * publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.total.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockTotal1, calculationId: mockTotal1.calculationId + x } }))
      await db.action.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockAction1, actionId: mockAction1.actionId + x, calculationId: mockTotal1.calculationId + x } }))

      publish()
      publish()

      await new Promise(resolve => setTimeout(resolve, 1000))
      expect(mockSendMessage).toHaveBeenCalledTimes(numberOfRecords)
    })

    test('should not process all total records when there are 3 times the number of total records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecords = 3 * publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.total.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockTotal1, calculationId: mockTotal1.calculationId + x } }))
      await db.action.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockAction1, actionId: mockAction1.actionId + x, calculationId: mockTotal1.calculationId + x } }))
      const unpublishedBefore = await db.total.findAll({ where: { datePublished: null } })

      publish()
      publish()

      await new Promise(resolve => setTimeout(resolve, 1000))
      const unpublishedAfter = await db.total.findAll({ where: { datePublished: null } })
      expect(unpublishedBefore).toHaveLength(numberOfRecords)
      expect(unpublishedAfter).toHaveLength(publishingConfig.dataPublishingMaxBatchSizePerDataSource)
    })

    test('should not publish all total records when there are 3 times the number of total records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecords = 3 * publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.total.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockTotal1, calculationId: mockTotal1.calculationId + x } }))
      await db.action.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockAction1, actionId: mockAction1.actionId + x, calculationId: mockTotal1.calculationId + x } }))

      publish()
      publish()

      await new Promise(resolve => setTimeout(resolve, 1000))
      expect(mockSendMessage).toHaveBeenCalledTimes(2 * publishingConfig.dataPublishingMaxBatchSizePerDataSource)
      expect(mockSendMessage).not.toHaveBeenCalledTimes(numberOfRecords)
    })
  })
})
