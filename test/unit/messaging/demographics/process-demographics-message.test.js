const moment = require('moment')
const { getAddressLines } = require('../../../../app/messaging/demographics/get-address-lines')
const { getSBI } = require('../../../../app/messaging/demographics/get-sbi')
const { createKnexMock } = require('../../../helpers/mock-knex')

const mockDb = createKnexMock(['organisation'])

jest.mock('../../../../app/messaging/demographics/get-address-lines')
jest.mock('../../../../app/messaging/demographics/get-sbi')
jest.mock('../../../../app/database', () => ({
  client: mockDb.knex,
  transaction: mockDb.transaction,
  close: mockDb.close,
  ...mockDb.tables
}))
jest.mock('../../../../app/messaging/create-alerts')

const processDemographicsMessage = require('../../../../app/messaging/demographics/process-demographics-message')

let demographicsData

describe('process demographics message', () => {
  let receiver

  beforeEach(() => {
    demographicsData = JSON.parse(JSON.stringify(require('../../../mocks/demographics-extracts/organisation-standard-SBI')))
    receiver = {
      completeMessage: jest.fn(),
      deadLetterMessage: jest.fn()
    }
    getAddressLines.mockReturnValue({
      addressLine1: 'Address line 1 Manual',
      addressLine2: 'Address line 2 Manual',
      addressLine3: 'Address line 3 Manual'
    })
    getSBI.mockReturnValue('123456789')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should create new demographics data if SBI does not exist in db', async () => {
    mockDb.builder.resolves(undefined)

    await processDemographicsMessage(demographicsData, receiver)
    expect(getAddressLines).toHaveBeenCalledWith(demographicsData.body.address[0])
    expect(getSBI).toHaveBeenCalledWith(demographicsData.body)
    expect(mockDb.tables.organisation).toHaveBeenCalledWith()
    expect(mockDb.builder.where).toHaveBeenCalledWith({ sbi: '123456789' })
    expect(mockDb.builder.insert).toHaveBeenCalled()
    expect(receiver.completeMessage).toHaveBeenCalledWith(demographicsData)
  })

  test('should update existing demographics data if SBI exists in db', async () => {
    mockDb.builder.resolves({ sbi: '123456789' })

    await processDemographicsMessage(demographicsData, receiver)

    expect(getAddressLines).toHaveBeenCalledWith(demographicsData.body.address[0])
    expect(getSBI).toHaveBeenCalledWith(demographicsData.body)
    expect(mockDb.builder.where).toHaveBeenCalledWith({ sbi: '123456789' })
    expect(mockDb.builder.update).toHaveBeenCalled()
    expect(receiver.completeMessage).toHaveBeenCalledWith(demographicsData)
  })

  test('should not update database if sbi is null', async () => {
    getSBI.mockReturnValue(null)
    await processDemographicsMessage(demographicsData, receiver)

    expect(getAddressLines).toHaveBeenCalledWith(demographicsData.body.address[0])
    expect(getSBI).toHaveBeenCalledWith(demographicsData.body)
    expect(mockDb.builder.where).not.toHaveBeenCalled()
    expect(mockDb.builder.update).not.toHaveBeenCalled()
  })

  test('should handle errors gracefully', async () => {
    const error = new Error('Test Error')
    mockDb.builder.rejects(error)

    console.error = jest.fn()

    await processDemographicsMessage(demographicsData, receiver)

    expect(console.error).toHaveBeenCalledWith('Unable to process demographics message:', error)
    expect(receiver.completeMessage).not.toHaveBeenCalled()
  })

  test('should ignore message received before day 0 date time', async () => {
    const message = {
      body: demographicsData.body,
      enqueuedTimeUtc: moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')
    }
    await processDemographicsMessage(message, receiver)
    expect(receiver.completeMessage).not.toHaveBeenCalled()
  })
})
