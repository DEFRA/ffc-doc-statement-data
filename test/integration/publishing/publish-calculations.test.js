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
const db = require('../../../app/data')
const publish = require('../../../app/publishing')
const { mockCalculation1, mockCalculation2, mockCalculation3 } = require('../../mocks/calculation')
const { mockFunding1, mockFunding2, mockFunding3 } = require('../../mocks/funding')

describe('publish calculations', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    jest.useFakeTimers().setSystemTime(new Date(2022, 7, 5, 15, 30, 10, 120))

    await db.sequelize.truncate({ cascade: true })
    await db.calculation.bulkCreate([mockCalculation1, mockCalculation2, mockCalculation3])
    await db.funding.bulkCreate([mockFunding1, mockFunding2])
  })

  afterAll(async () => {
    await db.sequelize.truncate({ cascade: true })
    await db.sequelize.close()
  })

  test('should publish only one message if one unpublished calculation', async () => {
    await publish()
    expect(mockSendMessage).toHaveBeenCalledTimes(1)
  })

  test('should publish unpublished calculation reference', async () => {
    await publish()
    expect(mockSendMessage.mock.calls[0][0].body.calculationReference).toBe(mockCalculation1.calculationId)
  })

  test('should publish unpublished calculation sbi', async () => {
    await publish()
    expect(mockSendMessage.mock.calls[0][0].body.sbi).toBe(mockCalculation1.sbi)
  })

  test('should publish unpublished calculation frn', async () => {
    await publish()
    expect(mockSendMessage.mock.calls[0][0].body.frn).toBe(mockCalculation1.frn.toString())
  })

  test('should publish unpublished invoice number', async () => {
    await publish()
    expect(mockSendMessage.mock.calls[0][0].body.invoiceNumber).toBe(mockCalculation3.invoiceNumber)
  })

  test('should publish unpublished calculation scheme', async () => {
    await publish()
    expect(mockSendMessage.mock.calls[0][0].body.scheme).toBe(mockCalculation3.scheme)
  })

  test('should publish unpublished calculation date', async () => {
    await publish()
    expect(mockSendMessage.mock.calls[0][0].body.calculationDate).toBe(mockCalculation1.calculationDate.toISOString())
  })

  test('should publish unpublished calculation updated date', async () => {
    await publish()
    expect(mockSendMessage.mock.calls[0][0].body.updated).toBe(mockCalculation1.updated.toISOString())
  })

  test('should publish unpublished funding', async () => {
    await publish()
    expect(mockSendMessage.mock.calls[0][0].body.fundings.length).toBe(1)
  })

  test('should publish unpublished funding rate', async () => {
    await publish()
    expect(mockSendMessage.mock.calls[0][0].body.fundings[0].rate).toBe(mockFunding1.rate.toFixed(6))
  })

  test('should publish unpublished funding code', async () => {
    await publish()
    expect(mockSendMessage.mock.calls[0][0].body.fundings[0].fundingCode).toBe(mockFunding1.fundingCode)
  })

  test('should publish unpublished funding area claimed', async () => {
    await publish()
    expect(mockSendMessage.mock.calls[0][0].body.fundings[0].areaClaimed).toBe(mockFunding1.areaClaimed.toFixed(4))
  })

  test('should not publish unpublished funding primary key', async () => {
    await publish()
    expect(mockSendMessage.mock.calls[0][0].body.fundings[0].fundingId).toBeUndefined()
  })

  test('should publish unpublished type', async () => {
    await publish()
    expect(mockSendMessage.mock.calls[0][0].body.type).toBe('calculation')
  })

  test('should not publish null published value', async () => {
    await publish()
    expect(mockSendMessage.mock.calls[0][0].body.published).toBeUndefined()
  })

  test('should update published date', async () => {
    await publish()
    const calculation = await db.calculation.findByPk(1234567)
    expect(calculation.published).toStrictEqual(new Date(2022, 7, 5, 15, 30, 10, 120))
  })

  test('should not publish same calculation on second run', async () => {
    await publish()
    await publish()
    expect(mockSendMessage).toHaveBeenCalledTimes(1)
  })

  test('should publish all funding options if multiple', async () => {
    await db.funding.create(mockFunding3)
    await publish()
    expect(mockSendMessage.mock.calls[0][0].body.fundings.length).toBe(2)
  })

  test('should re-publish if previously published dataset updated', async () => {
    await publish()
    await db.calculation.update({ updated: new Date(2022, 8, 5, 15, 30, 10, 121) }, { where: { calculationId: 1234567 } })
    await publish()
    expect(mockSendMessage).toHaveBeenCalledTimes(2)
  })
})
