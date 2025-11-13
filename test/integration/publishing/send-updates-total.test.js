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

describe('sendOrganisationUpdates', () => {
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

  describe('whenOrganisationIsUnpublished', () => {
    beforeEach(async () => {
      await db.organisation.bulkCreate([mockOrganisation1, mockOrganisation2])
    })

    test('should call sendMessage once', async () => {
      await publish.start()
      expect(mockSendMessage).toHaveBeenCalledTimes(1)
    })

    test.each([
      ['sbi', 'sbi'],
      ['frn', 'frn'],
      ['name', 'name'],
      ['email address', 'emailAddress'],
      ['address line 1', 'addressLine1'],
      ['address line 2', 'addressLine2'],
      ['address line 3', 'addressLine3'],
      ['city', 'city'],
      ['county', 'county'],
      ['postcode', 'postcode']
    ])('should publish organisation %s', async (_, field) => {
      await publish.start()
      expect(mockSendMessage.mock.calls[0][0].body[field]).toBe(mockOrganisation1[field])
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

  describe('whenMultipleOrganisationsAreUnpublished', () => {
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
