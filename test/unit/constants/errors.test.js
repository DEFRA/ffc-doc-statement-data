const errors = require('../../../app/constants/errors')

describe('errors constants', () => {
  test('should have VALIDATION property', () => {
    expect(errors).toHaveProperty('VALIDATION')
  })

  test('VALIDATION should be "validation"', () => {
    expect(errors.VALIDATION).toBe('validation')
  })
})
