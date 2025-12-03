const { validateDemographicsData } = require('../../../../app/messaging/demographics/validate-demographics-data')
const schema = require('../../../../app/messaging/demographics/demographics-schema')
const { VALIDATION } = require('../../../../app/constants/error-categories')

jest.mock('../../../../app/messaging/demographics/demographics-schema')

describe('validateDemographicsData', () => {
  let demographicsData

  beforeEach(() => {
    demographicsData = {
      name: 'Test Name',
      sbi: 105000000,
      frn: 1000000000,
      addressLine1: '123 Main St',
      city: 'Anytown',
      postcode: 'AB1 2CD',
      updated: new Date()
    }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should validate successfully for valid data', () => {
    schema.validate.mockReturnValue({ error: null })

    expect(() => validateDemographicsData(demographicsData)).not.toThrow()
  })

  test('should throw validation error for invalid data', () => {
    const errorMessage = 'Validation error'
    const validationError = {
      error: {
        message: errorMessage
      }
    }
    schema.validate.mockReturnValue(validationError)

    expect(() => validateDemographicsData(demographicsData)).toThrow(Error)
    expect(() => validateDemographicsData(demographicsData)).toThrow(`${demographicsData} dataset is invalid, ${errorMessage}`)
  })

  test('should log error message on validation failure', () => {
    const errorMessage = 'Validation error'
    const validationError = {
      error: {
        message: errorMessage
      }
    }
    schema.validate.mockReturnValue(validationError)
    console.error = jest.fn()

    expect(() => validateDemographicsData(demographicsData)).toThrow()
    expect(console.error).toHaveBeenCalledWith(`${demographicsData} dataset is invalid, ${errorMessage}`)
  })

  test('should set error category to VALIDATION', () => {
    const validationError = {
      error: {
        message: 'Validation error'
      }
    }
    schema.validate.mockReturnValue(validationError)

    try {
      validateDemographicsData(demographicsData)
    } catch (err) {
      expect(err.category).toBe(VALIDATION)
    }
  })
})
