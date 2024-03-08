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

const { mockTotal1 } = require('../../mocks/totals')

describe('send total updates', () => {
  beforeEach(async () => {
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
      await db.total.bulkCreate(mockTotal1)
    })

    test('should call sendMessage once', async () => {
      await publish()
      expect(mockSendMessage).toHaveBeenCalledTimes(1)
    })

    test('should publish totals sbi', async () => {
      await publish()
      expect(mockSendMessage.mock.calls[0][0].body.sbi).toBe(mockTotal1.sbi)
    })

    //   test('should not publish same total on second run if record has not been updated', async () => {
    //     await publish()
    //     await publish()
    //     expect(mockSendMessage).toHaveBeenCalledTimes(1)
    //   })
    // })

    // describe('When total has been updated', () => {
    //   beforeEach(async () => {
    //     await db.total.bulkCreate(mockTotal1)
    //   })

  //   test('should call sendMessage twice', async () => {
  //     await publish()
  //     await db.total.update({ updated: new Date(2022, 8, 5, 15, 30, 10, 121) }, { where: { calculationId: 1234567 } })
  //     await publish()
  //     expect(mockSendMessage).toHaveBeenCalledTimes(2)
  //   })
  })
})
