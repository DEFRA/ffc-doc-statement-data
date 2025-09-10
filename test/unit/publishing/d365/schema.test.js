const { D365 } = require('../../../../app/constants/types')
const schema = require('../../../../app/publishing/d365/schema')

describe('Validation Schema Tests', () => {
  test('should validate a valid input', () => {
    const validInput = {
      paymentReference: '123456789012345678901234567890',
      calculationReference: 123,
      marketingYear: 2023,
      paymentPeriod: '2023-Q1',
      paymentAmount: 1000.50,
      transactionDate: '2023-01-01',
      datePublished: '2023-01-02',
      type: D365
    }

    const { error } = schema.validate(validInput)
    expect(error).toBeUndefined()
  })

  test('should require paymentReference', () => {
    const invalidInput = {
      calculationReference: 123,
      marketingYear: 2023,
      paymentPeriod: '2023-Q1',
      paymentAmount: 1000.50,
      transactionDate: '2023-01-01',
      datePublished: '2023-01-02',
      type: D365
    }

    const { error } = schema.validate(invalidInput)
    expect(error).toBeDefined()
    expect(error.details[0].message).toBe('The field paymentReference is not present but it is required')
  })

  test('should limit paymentReference to a maximum length of 30 characters', () => {
    const invalidInput = {
      paymentReference: '1234567890123456789012345678901',
      calculationReference: 123,
      marketingYear: 2023,
      paymentPeriod: '2023-Q1',
      paymentAmount: 1000.50,
      transactionDate: '2023-01-01',
      datePublished: '2023-01-02',
      type: D365
    }

    const { error } = schema.validate(invalidInput)
    expect(error).toBeDefined()
    expect(error.details[0].message).toBe('paymentReference should have a maximum length of 30')
  })

  test('should require marketingYear', () => {
    const invalidInput = {
      paymentReference: 'validReference',
      calculationReference: 123,
      paymentPeriod: '2023-Q1',
      paymentAmount: 1000.50,
      transactionDate: '2023-01-01',
      datePublished: '2023-01-02',
      type: D365
    }

    const { error } = schema.validate(invalidInput)
    expect(error).toBeDefined()
    expect(error.details[0].message).toBe('The field marketingYear is not present but it is required')
  })

  test('should enforce marketingYear min/max boundaries', () => {
    const invalidInput = {
      paymentReference: 'validReference',
      calculationReference: 123,
      marketingYear: 2022,
      paymentPeriod: '2023-Q1',
      paymentAmount: 1000.50,
      transactionDate: '2023-01-01',
      datePublished: '2023-01-02',
      type: D365
    }

    const { error } = schema.validate(invalidInput)
    expect(error).toBeDefined()
    expect(error.details[0].message).toBe('marketingYear must be greater than or equal to 2023')
  })

  test('should require paymentPeriod', () => {
    const invalidInput = {
      paymentReference: 'validReference',
      calculationReference: 123,
      marketingYear: 2023,
      paymentAmount: 1000.50,
      transactionDate: '2023-01-01',
      datePublished: '2023-01-02',
      type: D365
    }

    const { error } = schema.validate(invalidInput)
    expect(error).toBeDefined()
    expect(error.details[0].message).toBe('The field paymentPeriod is not present but it is required')
  })

  test('should require paymentAmount', () => {
    const invalidInput = {
      paymentReference: 'validReference',
      calculationReference: 123,
      marketingYear: 2023,
      paymentPeriod: '2023-Q1',
      transactionDate: '2023-01-01',
      datePublished: '2023-01-02',
      type: D365
    }

    const { error } = schema.validate(invalidInput)
    expect(error).toBeDefined()
    expect(error.details[0].message).toBe('The field paymentAmount is not present but it is required')
  })

  test('should require transactionDate', () => {
    const invalidInput = {
      paymentReference: 'validReference',
      calculationReference: 123,
      marketingYear: 2023,
      paymentPeriod: '2023-Q1',
      paymentAmount: 1000.50,
      datePublished: '2023-01-02',
      type: D365
    }

    const { error } = schema.validate(invalidInput)
    expect(error).toBeDefined()
    expect(error.details[0].message).toBe('The field transactionDate is not present but it is required')
  })

  test('should require type to be D365', () => {
    const invalidInput = {
      paymentReference: 'validReference',
      calculationReference: 123,
      marketingYear: 2023,
      paymentPeriod: '2023-Q1',
      paymentAmount: 1000.50,
      transactionDate: '2023-01-01',
      datePublished: '2023-01-02',
      type: 'INVALID_TYPE'
    }

    const { error } = schema.validate(invalidInput)
    expect(error).toBeDefined()
    expect(error.details[0].message).toBe(`type must be : ${D365}`)
  })
})
