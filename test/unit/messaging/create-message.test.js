const createMessage = require('../../../app/messaging/create-message')
const body = {
  content: 'hello'
}
const type = 'message'
const source = 'ffc-doc-statement-constructor'

describe('create message', () => {
  test('includes body', () => {
    const result = createMessage(body, type, source)
    expect(result.body).toStrictEqual(body)
  })

  test('includes type', () => {
    const result = createMessage(body, type, source)
    expect(result.type).toBe('message')
  })

  test('includes source', () => {
    const result = createMessage(body, type, source)
    expect(result.source).toBe('ffc-doc-statement-constructor')
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

  test('overrides body, type, or source if provided in options', () => {
    const options = { body: { content: 'override' }, type: 'override-type', source: 'override-source' }
    const result = createMessage(body, type, source, options)
    expect(result.body).toStrictEqual({ content: 'override' })
    expect(result.type).toBe('override-type')
    expect(result.source).toBe('override-source')
  })
})
