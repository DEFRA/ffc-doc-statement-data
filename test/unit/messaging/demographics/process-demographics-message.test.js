const moment = require('moment')
const { getAddressLines } = require('../../../../app/messaging/demographics/get-address-lines')
const { getSBI } = require('../../../../app/messaging/demographics/get-sbi')
const db = require('../../../../app/data')
const processDemographicsMessage = require('../../../../app/messaging/demographics/process-demographics-message')

jest.mock('../../../../app/messaging/demographics/get-address-lines')
jest.mock('../../../../app/messaging/demographics/get-sbi')
jest.mock('../../../../app/data')

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
    db.organisation.findOne.mockResolvedValue(null)
    db.organisation.create.mockResolvedValue()

    await processDemographicsMessage(demographicsData, receiver)
    expect(getAddressLines).toHaveBeenCalledWith(demographicsData.body.address[0])
    expect(getSBI).toHaveBeenCalledWith(demographicsData.body)
    expect(db.organisation.findOne).toHaveBeenCalledWith({ where: { sbi: '123456789' } })
    expect(db.organisation.create).toHaveBeenCalled()
    expect(receiver.completeMessage).toHaveBeenCalledWith(demographicsData)
  })

  test('should update existing demographics data if SBI exists in db', async () => {
    db.organisation.findOne.mockResolvedValue({ sbi: '123456789' })
    db.organisation.update.mockResolvedValue()

    await processDemographicsMessage(demographicsData, receiver)

    expect(getAddressLines).toHaveBeenCalledWith(demographicsData.body.address[0])
    expect(getSBI).toHaveBeenCalledWith(demographicsData.body)
    expect(db.organisation.findOne).toHaveBeenCalledWith({ where: { sbi: '123456789' } })
    expect(db.organisation.update).toHaveBeenCalled()
    expect(receiver.completeMessage).toHaveBeenCalledWith(demographicsData)
  })

  test('should not update database if sbi is null', async () => {
    getSBI.mockReturnValue(null)
    await processDemographicsMessage(demographicsData, receiver)

    expect(getAddressLines).toHaveBeenCalledWith(demographicsData.body.address[0])
    expect(getSBI).toHaveBeenCalledWith(demographicsData.body)
    expect(db.organisation.findOne).not.toHaveBeenCalled()
    expect(db.organisation.update).not.toHaveBeenCalled()
  })

  test('should handle errors gracefully', async () => {
    const error = new Error('Test Error')
    db.organisation.findOne.mockRejectedValue(error)

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
