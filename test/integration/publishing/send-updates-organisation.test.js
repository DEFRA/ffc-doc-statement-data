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

const { mockOrganisation1, mockOrganisation2 } = require('../../mocks/organisation')

describe('send organisation updates', () => {
  beforeEach(async () => {
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

  describe('When organisation is unpublished', () => {
    beforeEach(async () => {
      await db.organisation.bulkCreate([mockOrganisation1, mockOrganisation2])
    })

    test('should call sendMessage once', async () => {
      await publish.start()
      expect(mockSendMessage).toHaveBeenCalledTimes(1)
    })

    test('should publish organisation sbi', async () => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.sbi).toBe(mockOrganisation1.sbi)
    })

    test('should publish organisation frn', async () => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.frn).toBe(mockOrganisation1.frn)
    })

    test('should publish organisation name', async () => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.name).toBe(mockOrganisation1.name)
    })

    test('should publish organisation email address', async () => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.emailAddress).toBe(mockOrganisation1.emailAddress)
    })

    test('should publish organisation address line 1', async () => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.addressLine1).toBe(mockOrganisation1.addressLine1)
    })

    test('should publish organisation address line 2', async () => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.addressLine2).toBe(mockOrganisation1.addressLine2)
    })

    test('should publish organisation address line 3', async () => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.addressLine3).toBe(mockOrganisation1.addressLine3)
    })

    test('should publish organisation city', async () => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.city).toBe(mockOrganisation1.city)
    })

    test('should publish organisation county', async () => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.county).toBe(mockOrganisation1.county)
    })

    test('should publish organisation postcode', async () => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.postcode).toBe(mockOrganisation1.postcode)
    })

    test('should publish organisation updated date', async () => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.updated).toBe(mockOrganisation1.updated.toISOString())
    })

    test('should publish type', async () => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.type).toBe('organisation')
    })

    test('should not publish null published value', async () => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body.published).toBeUndefined()
    })

    test('should update published date', async () => {
      await publish.start()
      const organisation = await db.organisation.findByPk(123456789)
      expect(organisation.published).toStrictEqual(new Date(2022, 7, 5, 15, 30, 10, 120))
    })

    test('should call a console log with number of datasets published for organisations', async () => {
      const logSpy = jest.spyOn(global.console, 'log')
      await publish.start()
      expect(logSpy.mock.calls).toContainEqual(['1 organisation datasets published'])
    })

    test('should not publish same organisation on second run if record has not been updated', async () => {
      await publish.start()
      await publish.start()
      expect(mockSendMessage).toHaveBeenCalledTimes(1)
    })
  })

  describe('When multiple organisations are unpublished', () => {
    test('should process all records when there are less records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecords = -1 + publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.organisation.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockOrganisation1, sbi: mockOrganisation1.sbi + x } }))
      const unpublishedBefore = await db.organisation.findAll({ where: { published: null } })

      await publish.start()

      const unpublishedAfter = await db.organisation.findAll({ where: { published: null } })
      expect(unpublishedBefore).toHaveLength(numberOfRecords)
      expect(unpublishedAfter).toHaveLength(0)
    })

    test('should process all records when there are equal number of records than publishingConfig.dataPublishingMaxBatchSizePerDataSource', async () => {
      const numberOfRecords = publishingConfig.dataPublishingMaxBatchSizePerDataSource
      await db.organisation.bulkCreate([...Array(numberOfRecords).keys()].map(x => { return { ...mockOrganisation1, sbi: mockOrganisation1.sbi + x } }))
      const unpublishedBefore = await db.organisation.findAll({ where: { published: null } })

      await publish.start()

      const unpublishedAfter = await db.organisation.findAll({ where: { published: null } })
      expect(unpublishedBefore).toHaveLength(numberOfRecords)
      expect(unpublishedAfter).toHaveLength(0)
    })
  })
})
