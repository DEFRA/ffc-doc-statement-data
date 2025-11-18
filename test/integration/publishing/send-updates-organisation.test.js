const mockSendMessage = jest.fn()
const mockCloseConnection = jest.fn()

jest.mock('ffc-messaging', () => ({
  MessageSender: jest.fn().mockImplementation(() => ({
    sendMessage: mockSendMessage,
    closeConnection: mockCloseConnection
  }))
}))

jest.mock('../../../app/publishing/subset/update-subset-check', () => jest.fn().mockResolvedValue(true))

const { publishingConfig } = require('../../../app/config')
const db = require('../../../app/data')
const publish = require('../../../app/publishing')
const { mockOrganisation1, mockOrganisation2 } = require('../../mocks/organisation')
const maxBatchSize = 5

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
      ['sbi', (body) => body.sbi, mockOrganisation1.sbi],
      ['frn', (body) => body.frn, mockOrganisation1.frn],
      ['name', (body) => body.name, mockOrganisation1.name],
      ['emailAddress', (body) => body.emailAddress, mockOrganisation1.emailAddress],
      ['addressLine1', (body) => body.addressLine1, mockOrganisation1.addressLine1],
      ['addressLine2', (body) => body.addressLine2, mockOrganisation1.addressLine2],
      ['addressLine3', (body) => body.addressLine3, mockOrganisation1.addressLine3],
      ['city', (body) => body.city, mockOrganisation1.city],
      ['county', (body) => body.county, mockOrganisation1.county],
      ['postcode', (body) => body.postcode, mockOrganisation1.postcode],
      ['updated', (body) => body.updated, mockOrganisation1.updated.toISOString()],
      ['type', (body) => body.type, 'organisation']
    ])('should publish organisation %s', async (_, getValue, expected) => {
      await publish.start()
      const body = mockSendMessage.mock.calls[0][0].body
      expect(getValue(body)).toBe(expected)
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
    test.each([
      ['less than max batch size', maxBatchSize -1],
      ['equal to max batch size', maxBatchSize]
    ])('should process all records when there are %s', async (_, recordCount) => {
      publishingConfig.dataPublishingMaxBatchSizePerDataSource = 5
      await db.organisation.bulkCreate(
        [...Array(recordCount).keys()].map(x => ({
          ...mockOrganisation1,
          sbi: mockOrganisation1.sbi + x
        }))
      )

      const unpublishedBefore = await db.organisation.findAll({ where: { published: null } })
      await publish.start()
      const unpublishedAfter = await db.organisation.findAll({ where: { published: null } })

      expect(unpublishedBefore).toHaveLength(recordCount)
      expect(unpublishedAfter).toHaveLength(0)
    })
  })
})
