const demographicsSchema = require('../../../app/messaging/demographics-schema')

describe('Demographics Validation', () => {
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

  test('should validate valid input', () => {
    const { error } = demographicsSchema.validate(validData)
    expect(error).toBeUndefined()
  })

  test.each([
    ['name', undefined, 'The field name is not present but it is required'],
    ['updated', undefined, 'The field updated is not present but it is required'],
    ['sbi', 104999999, 'sbi should have a minimum value of 105000000'],
    ['frn', 999999999, 'frn should have a minimum value of 1000000000'],
    ['name', 'A'.repeat(161), 'name should have a maximum length of 160'],
    ['emailAddress', 'A'.repeat(261) + '@example.com', 'emailAddress should have a maximum length of 260']
  ])('should throw error for invalid %s', (field, value, expectedMessage) => {
    const invalidData = { ...validData, [field]: value }
    const { error } = demographicsSchema.validate(invalidData)
    expect(error).toBeDefined()
    expect(error.details[0].message).toBe(expectedMessage)
  })

  test('should allow optional fields to be empty', () => {
    const optionalEmpty = {
      ...validData,
      addressLine1: '',
      addressLine2: '',
      addressLine3: '',
      city: '',
      county: '',
      postcode: '',
      emailAddress: ''
    }
    const { error } = demographicsSchema.validate(optionalEmpty)
    expect(error).toBeUndefined()
  })
})
