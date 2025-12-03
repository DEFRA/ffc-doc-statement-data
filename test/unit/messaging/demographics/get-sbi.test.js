const { getSBI } = require('../../../../app/messaging/demographics/get-sbi')

describe('get SBI from data', () => {
  let legacySBI
  let standardSBI

  beforeEach(() => {
    legacySBI = JSON.parse(JSON.stringify(require('../../../mocks/demographics-extracts/organisation-legacy-SBI'))).body
    standardSBI = JSON.parse(JSON.stringify(require('../../../mocks/demographics-extracts/organisation-standard-SBI'))).body
  })

  const testCases = [
    {
      name: 'returns SBI from organisation data when present',
      input: () => standardSBI,
      expected: 115344613
    },
    {
      name: 'returns SBI from legacyIdentifier when not in organisation',
      input: () => legacySBI,
      expected: 115344613
    },
    {
      name: 'returns null when no SBI in organisation or legacyIdentifier',
      input: () => ({
        organisation: {},
        legacyIdentifier: [
          { partyId: 5671508, type: 'Trader Number', value: '515273' }
        ]
      }),
      expected: null
    },
    {
      name: 'returns null when legacyIdentifier is null',
      input: () => ({
        organisation: {},
        legacyIdentifier: null
      }),
      expected: null
    },
    {
      name: 'returns null when legacyIdentifier is undefined',
      input: () => ({
        organisation: {},
        legacyIdentifier: undefined
      }),
      expected: null
    },
    {
      name: 'returns null when legacyIdentifier is an empty array',
      input: () => ({
        organisation: {},
        legacyIdentifier: []
      }),
      expected: null
    }
  ]

  test.each(testCases)('$name', ({ input, expected }) => {
    expect(getSBI(input())).toBe(expected)
  })
})
