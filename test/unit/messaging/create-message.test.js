const createMessage = require('../../../app/messaging/create-message')

describe('createMessage', () => {
  const body = { content: 'hello' }
  const type = 'message'
  const source = 'ffc-doc-statement-constructor'

  test.each([
    ['body', body],
    ['type', type],
    ['source', source]
  ])('includes %s property', (prop, expected) => {
    const result = createMessage(body, type, source)
    expect(result[prop]).toStrictEqual(expected)
  })

  test('includes additional options properties', () => {
    const options = { correlationId: 'abc123', priority: 'high' }
    const result = createMessage(body, type, source, options)
    expect(result.correlationId).toBe('abc123')
    expect(result.priority).toBe('high')
  })

  test('does not include options properties if options is undefined', () => {
    const result = createMessage(body, type, source)
    expect(result).not.toHaveProperty('correlationId')
    expect(result).not.toHaveProperty('priority')
  })

  test.each([
    ['body', { content: 'override' }],
    ['type', 'override-type'],
    ['source', 'override-source']
  ])('overrides %s if provided in options', (prop, value) => {
    const options = { [prop]: value }
    const result = createMessage(body, type, source, options)
    expect(result[prop]).toStrictEqual(value)
  })
})
