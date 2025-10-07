const demographicsSchema = require('../../../app/messaging/demographics-schema')

describe('Demographics Validation', () => {
  test('should validate valid input', () => {
    const validData = {
      name: 'Valid Name',
      sbi: 105000000,
      frn: 1000000000,
      addressLine1: '123 Main St',
      addressLine2: 'Apt 4B',
      addressLine3: '',
      city: 'Anytown',
      county: 'Anycounty',
      postcode: 'AB1 2CD',
      emailAddress: 'test@example.com',
      updated: new Date()
    }

    const { error } = demographicsSchema.validate(validData)
    expect(error).toBeUndefined()
  })

  test('should throw error if name is missing', () => {
    const invalidData = {
      sbi: 105000000,
      frn: 1000000000,
      updated: new Date()
    }

    const { error } = demographicsSchema.validate(invalidData)
    expect(error).toBeDefined()
    expect(error.details[0].message).toBe('The field name is not present but it is required')
  })

  test('should throw error if sbi is out of range', () => {
    const invalidData = {
      name: 'Valid Name',
      sbi: 104999999,
      frn: 1000000000,
      updated: new Date()
    }

    const { error } = demographicsSchema.validate(invalidData)
    expect(error).toBeDefined()
    expect(error.details[0].message).toBe('sbi should have a minimum value of 105000000')
  })

  test('should throw error if frn is out of range', () => {
    const invalidData = {
      name: 'Valid Name',
      sbi: 105000000,
      frn: 999999999,
      updated: new Date()
    }

    const { error } = demographicsSchema.validate(invalidData)
    expect(error).toBeDefined()
    expect(error.details[0].message).toBe('frn should have a minimum value of 1000000000')
  })

  test('should throw error if updated is missing', () => {
    const invalidData = {
      name: 'Valid Name',
      sbi: 105000000,
      frn: 1000000000
    }

    const { error } = demographicsSchema.validate(invalidData)
    expect(error).toBeDefined()
    expect(error.details[0].message).toBe('The field updated is not present but it is required')
  })

  test('should allow optional fields to be empty', () => {
    const validData = {
      name: 'Valid Name',
      sbi: 105000000,
      frn: 1000000000,
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      city: '',
      county: '',
      postcode: '',
      emailAddress: '',
      updated: new Date()
    }

    const { error } = demographicsSchema.validate(validData)
    expect(error).toBeUndefined()
  })

  test('should throw error if name exceeds max length', () => {
    const invalidData = {
      name: 'A'.repeat(161),
      sbi: 105000000,
      frn: 1000000000,
      updated: new Date()
    }

    const { error } = demographicsSchema.validate(invalidData)
    expect(error).toBeDefined()
    expect(error.details[0].message).toBe('name should have a maximum length of 160')
  })

  test('should throw error if emailAddress exceeds max length', () => {
    const invalidData = {
      name: 'Valid Name',
      sbi: 105000000,
      frn: 1000000000,
      emailAddress: 'A'.repeat(261) + '@example.com',
      updated: new Date()
    }

    const { error } = demographicsSchema.validate(invalidData)
    expect(error).toBeDefined()
    expect(error.details[0].message).toBe('emailAddress should have a maximum length of 260')
  })
})
