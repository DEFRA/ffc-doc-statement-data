const { getAddressLines } = require('../../../app/messaging/get-address-lines')

let manualAddress
let lookupAddress

describe('get correct address lines', () => {
  beforeEach(async () => {
    manualAddress = JSON.parse(JSON.stringify(require('../../mocks/demographics-extracts/organisation-manual-address'))).body.address[0]
    lookupAddress = JSON.parse(JSON.stringify(require('../../mocks/demographics-extracts/organisation-lookup-address'))).body.address[0]
  })

  test('returns address lines from manual entry', () => {
    const result = getAddressLines(manualAddress)
    expect(result).toEqual({
      addressLine1: 'Address line 1 Manual',
      addressLine2: 'Address line 2 Manual',
      addressLine3: 'Address line 3 Manual'
    })
  })

  test('returns address lines from lookup entry', () => {
    const result = getAddressLines(lookupAddress)
    expect(result).toEqual({
      addressLine1: 'FLAT 2 THORNEWILL HOUSE',
      addressLine2: 'CABLE STREET',
      addressLine3: null
    })
  })

  test('returns address lines from lookup entry with only flatName', () => {
    lookupAddress.buildingName = null
    const result = getAddressLines(lookupAddress)
    expect(result).toEqual({
      addressLine1: 'FLAT 2',
      addressLine2: 'CABLE STREET',
      addressLine3: null
    })
  })

  test('returns address lines from lookup entry with only buildingName', () => {
    lookupAddress.flatName = null
    const result = getAddressLines(lookupAddress)
    expect(result).toEqual({
      addressLine1: 'THORNEWILL HOUSE',
      addressLine2: 'CABLE STREET',
      addressLine3: null
    })
  })

  test('returns address lines from lookup entry with no flatName or buildingName', () => {
    lookupAddress.flatName = null
    lookupAddress.buildingName = null
    const result = getAddressLines(lookupAddress)
    expect(result).toEqual({
      addressLine1: null,
      addressLine2: 'CABLE STREET',
      addressLine3: null
    })
  })

  test('returns address lines from lookup entry with no buildingNumber', () => {
    lookupAddress.buildingNumberRange = null
    const result = getAddressLines(lookupAddress)
    expect(result).toEqual({
      addressLine1: 'FLAT 2 THORNEWILL HOUSE',
      addressLine2: 'CABLE STREET',
      addressLine3: null
    })
  })

  test('returns null for empty address', () => {
    const address = {}
    const result = getAddressLines(address)
    expect(result).toBeNull()
  })

  test('returns null when address is null', () => {
    const address = null
    const result = getAddressLines(address)
    expect(result).toBeNull()
  })

  test('returns null when address is undefined', () => {
    const address = undefined
    const result = getAddressLines(address)
    expect(result).toBeNull()
  })
})
