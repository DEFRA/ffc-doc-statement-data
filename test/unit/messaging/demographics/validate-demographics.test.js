const { validateDemographics } = require('../../../../app/messaging/demographics/validate-demographics')
const { VALIDATION } = require('../../../../app/constants/errors')

describe('validateDemographics', () => {
  test('should not throw for valid demographics data', () => {
    const validData = {
      sbi: '123456789',
      city: 'London',
      county: 'Greater London',
      postcode: 'SW1A 1AA',
      emailAddress: 'test@example.com',
      frn: '9876543210',
      name: 'John Doe',
      updated: '2024-06-01T12:00:00Z',
      published: null,
      addressLine1: '10 Downing St',
      addressLine2: 'Westminster',
      addressLine3: 'London'
    }
    expect(() => validateDemographics(validData)).not.toThrow()
  })

  test('should throw validation error for missing required fields', () => {
    const invalidData = {
      city: 'London',
      updated: '2024-06-01T12:00:00Z'
    }
    try {
      validateDemographics(invalidData)
    } catch (err) {
      expect(err).toBeInstanceOf(Error)
      expect(err.category).toBe(VALIDATION)
      expect(err.message).toMatch(/Event is invalid/)
    }
  })

  test('should throw validation error for invalid email', () => {
    const invalidData = {
      sbi: '123456789',
      city: 'London',
      county: 'Greater London',
      postcode: 'SW1A 1AA',
      emailAddress: 'not-an-email',
      frn: '987654321',
      name: 'John Doe',
      updated: '2024-06-01T12:00:00Z',
      published: null,
      addressLine1: '10 Downing St',
      addressLine2: 'Westminster',
      addressLine3: 'London'
    }
    try {
      validateDemographics(invalidData)
    } catch (err) {
      expect(err).toBeInstanceOf(Error)
      expect(err.category).toBe(VALIDATION)
      expect(err.message).toMatch(/Event is invalid/)
    }
  })
})
