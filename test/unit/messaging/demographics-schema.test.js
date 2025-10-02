const demographicsSchema = require('../../../app/messaging/demographics-schema')

describe('demographics schema', () => {
  test('validates a fully populated valid payload', () => {
    const payload = {
      sbi: '123456789',
      city: 'London',
      county: 'Greater London',
      postcode: 'SW1A 1AA',
      emailAddress: 'test@example.com',
      frn: '987654321',
      name: 'John Doe',
      updated: '2024-06-01T12:00:00Z',
      published: true,
      addressLine1: '10 Downing St',
      addressLine2: 'Westminster',
      addressLine3: 'London'
    }
    const { error } = demographicsSchema.validate(payload)
    expect(error).toBeUndefined()
  })

  test('fails validation if required fields are missing', () => {
    const payload = {
      city: 'London',
      updated: '2024-06-01T12:00:00Z'
    }
    const { error } = demographicsSchema.validate(payload)
    expect(error).toBeDefined()
    expect(error.details.some(d => d.path.includes('sbi'))).toBe(true)
  })

  test('accepts null and empty string for optional fields', () => {
    const payload = {
      sbi: '123456789',
      city: null,
      county: '',
      postcode: null,
      emailAddress: '',
      frn: null,
      name: '',
      updated: '2024-06-01T12:00:00Z',
      published: null,
      addressLine1: '',
      addressLine2: null,
      addressLine3: ''
    }
    const { error } = demographicsSchema.validate(payload)
    expect(error).toBeUndefined()
  })

  test('fails validation for invalid email', () => {
    const payload = {
      sbi: '123456789',
      updated: '2024-06-01T12:00:00Z',
      emailAddress: 'not-an-email'
    }
    const { error } = demographicsSchema.validate(payload)
    expect(error).toBeDefined()
    expect(error.details.some(d => d.path.includes('emailAddress'))).toBe(true)
  })

  test('accepts published as any value', () => {
    const payload = {
      sbi: '123456789',
      updated: '2024-06-01T12:00:00Z',
      published: 123
    }
    const { error } = demographicsSchema.validate(payload)
    expect(error).toBeUndefined()
  })
})
