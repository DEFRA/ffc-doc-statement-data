const moment = require('moment')
const { getAddressLines } = require('../../../app/messaging/get-address-lines')
const { getSBI } = require('../../../app/messaging/get-sbi')
const db = require('../../../app/data')
const processDemographicsMessage = require('../../../app/messaging/process-demographics-message')
const { validateDemographics } = require('../../../app/messaging/validate-demographics')
const { VALIDATION } = require('../../../app/constants/errors')

jest.mock('moment')
jest.mock('../../../app/messaging/validate-demographics')
jest.mock('../../../app/messaging/get-address-lines')
jest.mock('../../../app/messaging/get-sbi')
jest.mock('../../../app/data')

let demographicsData

describe('process demographics message', () => {
  let receiver

  beforeEach(() => {
    demographicsData = JSON.parse(JSON.stringify(require('../../mocks/demographics-extracts/organisation-standard-SBI')))
    receiver = {
      completeMessage: jest.fn()
    }
    moment.mockReturnValue({ format: jest.fn().mockReturnValue('2024-07-12 12:00:00') })
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
    expect(db.organisation.create).toHaveBeenCalledWith({
      sbi: '123456789',
      city: 'LONDON',
      county: null,
      postcode: 'E1 0AP',
      emailAddress: 'pbaxterl@retxabph.com.test',
      frn: 1102905046,
      name: 'P Baxter',
      updated: '2024-07-12 12:00:00',
      published: null,
      addressLine1: 'Address line 1 Manual',
      addressLine2: 'Address line 2 Manual',
      addressLine3: 'Address line 3 Manual'
    })
    expect(receiver.completeMessage).toHaveBeenCalledWith(demographicsData)
  })

  test('should update existing demographics data if SBI exists in db', async () => {
    db.organisation.findOne.mockResolvedValue({ sbi: '123456789' })
    db.organisation.update.mockResolvedValue()

    await processDemographicsMessage(demographicsData, receiver)

    expect(getAddressLines).toHaveBeenCalledWith(demographicsData.body.address[0])
    expect(getSBI).toHaveBeenCalledWith(demographicsData.body)
    expect(db.organisation.findOne).toHaveBeenCalledWith({ where: { sbi: '123456789' } })
    expect(db.organisation.update).toHaveBeenCalledWith({
      sbi: '123456789',
      city: 'LONDON',
      county: null,
      postcode: 'E1 0AP',
      emailAddress: 'pbaxterl@retxabph.com.test',
      frn: 1102905046,
      name: 'P Baxter',
      updated: '2024-07-12 12:00:00',
      published: null,
      addressLine1: 'Address line 1 Manual',
      addressLine2: 'Address line 2 Manual',
      addressLine3: 'Address line 3 Manual'
    }, {
      where: { sbi: '123456789' }
    })
    expect(receiver.completeMessage).toHaveBeenCalledWith(demographicsData)
  })

  test('should not update database, complete message if sbi is null', async () => {
    getSBI.mockReturnValue(null)
    await processDemographicsMessage(demographicsData, receiver)

    expect(getAddressLines).toHaveBeenCalledWith(demographicsData.body.address[0])
    expect(getSBI).toHaveBeenCalledWith(demographicsData.body)
    expect(db.organisation.findOne).not.toHaveBeenCalled()
    expect(db.organisation.update).not.toHaveBeenCalled()
    expect(receiver.completeMessage).toHaveBeenCalledWith(demographicsData)
  })

  test('should handle errors gracefully', async () => {
    const error = new Error('Test Error')
    db.organisation.findOne.mockRejectedValue(error)

    console.error = jest.fn()

    await processDemographicsMessage(demographicsData, receiver)

    expect(console.error).toHaveBeenCalledWith('Unable to process demographics message:', error)
    expect(receiver.completeMessage).not.toHaveBeenCalled()
  })

  test('should call validateDemographics with correct data', async () => {
    db.organisation.findOne.mockResolvedValue(null)
    db.organisation.create.mockResolvedValue()
    validateDemographics.mockImplementation(() => undefined)

    await processDemographicsMessage(demographicsData, receiver)
    expect(validateDemographics).toHaveBeenCalledWith(expect.objectContaining({
      sbi: '123456789',
      city: 'LONDON'
    }))
  })

  test('should dead letter message if validation error occurs', async () => {
    const validationError = { category: VALIDATION }
    validateDemographics.mockImplementation(() => { throw validationError })
    receiver.deadLetterMessage = jest.fn()

    await processDemographicsMessage(demographicsData, receiver)

    expect(receiver.deadLetterMessage).toHaveBeenCalledWith(demographicsData)
    expect(receiver.completeMessage).not.toHaveBeenCalled()
  })

  test('should not dead letter if error is not validation', async () => {
    const error = new Error('Other error')
    validateDemographics.mockImplementation(() => { throw error })
    receiver.deadLetterMessage = jest.fn()

    await processDemographicsMessage(demographicsData, receiver)

    expect(receiver.deadLetterMessage).not.toHaveBeenCalled()
    expect(receiver.completeMessage).not.toHaveBeenCalled()
  })

  test('should allow additional fields not in validation object', async () => {
    db.organisation.findOne.mockResolvedValue(null)
    db.organisation.create.mockResolvedValue()
    validateDemographics.mockImplementation(() => undefined)

    demographicsData.body.extraField = 'unexpected value'

    await processDemographicsMessage(demographicsData, receiver)

    expect(validateDemographics).toHaveBeenCalled()
    expect(receiver.completeMessage).toHaveBeenCalledWith(demographicsData)
    expect(db.organisation.create).toHaveBeenCalled()
  })
})
