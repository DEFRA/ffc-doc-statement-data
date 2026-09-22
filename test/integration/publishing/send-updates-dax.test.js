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
const db = require('../../../app/database')
const publish = require('../../../app/publishing')
const { truncate } = require('../../helpers/truncate')
const { mockDax1, mockDax2 } = require('../../mocks/dax')
const maxBatchSize = 5

// The dax mocks carry message-only fields (type, calculationReference) that
// are not columns on the dax table - the deleted Sequelize model silently
// dropped them on insert; whitelist the same way for Knex.
const daxRow = (dax) => {
  const { paymentReference, calculationId, paymentPeriod, paymentAmount, transactionDate, datePublished } = dax
  return { paymentReference, calculationId, paymentPeriod, paymentAmount, transactionDate, datePublished }
}

describe('sendDaxUpdates', () => {
  beforeEach(async () => {
    await truncate()
    jest.clearAllMocks()
    jest.useFakeTimers().setSystemTime(new Date(2022, 7, 5, 15, 30, 10, 120))
    publishingConfig.dataPublishingMaxBatchSizePerDataSource = 5
    publishingConfig.delinked.subsetProcess = false
    publishingConfig.publishingEnabled = true
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await truncate()
  })

  afterAll(async () => {
    await db.close()
  })

  describe('whenDaxIsUnpublished', () => {
    beforeEach(async () => {
      await db.dax().insert([daxRow(mockDax1), daxRow(mockDax2)])
    })

    test('should call sendMessage once', async () => {
      await publish.start()
      expect(mockSendMessage).toHaveBeenCalledTimes(1)
    })

    test.each([
      ['paymentReference', (body) => body.paymentReference, mockDax1.paymentReference],
      ['calculationReference', (body) => body.calculationReference, mockDax1.calculationId],
      ['paymentPeriod', (body) => body.paymentPeriod, mockDax1.paymentPeriod],
      ['paymentAmount', (body) => body.paymentAmount, mockDax1.paymentAmount.toString()],
      ['transactionDate', (body) => body.transactionDate, mockDax1.transactionDate.toISOString()]
    ])('should publish dax %s', async (_, getValue, expected) => {
      await publish.start()
      const body = mockSendMessage.mock.calls[0][0].body
      expect(getValue(body)).toBe(expected)
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

  describe('whenDaxHasBeenUpdated', () => {
    beforeEach(async () => {
      await db.dax().insert([daxRow(mockDax1), daxRow(mockDax2)])
    })

    test('should call sendMessage twice', async () => {
      await publish.start()
      await db.dax().where({ paymentReference: mockDax2.paymentReference }).update({ datePublished: null })
      await publish.start()
      expect(mockSendMessage).toHaveBeenCalledTimes(2)
    })
  })

  describe('whenMultipleDaxsAreUnpublished', () => {
    test.each([
      ['less than max batch size', maxBatchSize - 1],
      ['equal to max batch size', maxBatchSize]
    ])('should process all records when there are %s', async (_, recordCount) => {
      publishingConfig.dataPublishingMaxBatchSizePerDataSource = 5
      await db.dax().insert(
        [...Array(recordCount).keys()].map(x => daxRow({
          ...mockDax1,
          paymentReference: mockDax1.paymentReference + x
        }))
      )
      const unpublishedBefore = await db.dax().whereNull('datePublished')

      await publish.start()

      const unpublishedAfter = await db.dax().whereNull('datePublished')
      expect(unpublishedBefore).toHaveLength(recordCount)
      expect(unpublishedAfter).toHaveLength(0)
    })
  })
})
