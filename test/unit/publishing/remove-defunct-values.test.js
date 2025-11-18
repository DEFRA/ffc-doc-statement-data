const removeDefunctValues = require('../../../app/publishing/remove-defunct-values')

describe('removeDefunctValues', () => {
  const keepValues = [
    ['string', { p1: '1' }],
    ['number', { p1: 1 }],
    ['true', { p1: true }],
    ['false', { p1: false }],
    ['0', { p1: 0 }],
    ['empty object', {}]
  ]

  const removeValues = [
    ['undefined', { p1: undefined }, {}],
    ['null', { p1: null }, {}],
    ['function', { p1: () => 1 }, {}],
    ['properties ending with Id', { p1Id: 1 }, {}]
  ]

  test.each(keepValues)(
    'does not remove %s',
    (name, input) => {
      const result = removeDefunctValues(input)
      expect(result).toStrictEqual(input)
    }
  )

  test.each(removeValues)(
    'does remove %s',
    (name, input, expected) => {
      const result = removeDefunctValues(input)
      expect(result).toStrictEqual(expected)
    }
  )
})
