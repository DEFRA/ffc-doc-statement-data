const { getSBI } = require('../../../app/messaging/get-sbi')

let legacySBI
let standardSBI

describe('get SBI from data', () => {
  beforeEach(async () => {
    legacySBI = JSON.parse(JSON.stringify(require('../../mocks/demographics-extracts/organisation-legacy-SBI'))).body
    standardSBI = JSON.parse(JSON.stringify(require('../../mocks/demographics-extracts/organisation-standard-SBI'))).body
  })

  test('returns SBI from organisation data when present', () => {
    const result = getSBI(standardSBI)
    expect(result).toBe(115344613)
  })

  test('returns SBI from legacyIdentifier when not in organisation', () => {
    const result = getSBI(legacySBI)
    expect(result).toBe(115344613)
  })

  test('returns null when no SBI in organisation or legacyIdentifier', () => {
    const data = {
      organisation: {},
      legacyIdentifier: [
        { partyId: 5671508, type: 'Trader Number', value: '515273' }
      ]
    }
    const result = getSBI(data)
    expect(result).toBeNull()
  })

  test('returns null when legacyIdentifier is null', () => {
    const data = {
      organisation: {},
      legacyIdentifier: null
    }
    const result = getSBI(data)
    expect(result).toBeNull()
  })

  test('returns null when legacyIdentifier is undefined', () => {
    const data = {
      organisation: {},
      legacyIdentifier: undefined
    }
    const result = getSBI(data)
    expect(result).toBeNull()
  })

  test('returns null when legacyIdentifier is an empty array', () => {
    const data = {
      organisation: {},
      legacyIdentifier: []
    }
    const result = getSBI(data)
    expect(result).toBeNull()
  })
})
