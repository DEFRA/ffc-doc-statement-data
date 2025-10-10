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

  test('returns address lines from lookup entry if all fields present', () => {
    const result = getAddressLines(lookupAddress)
    expect(result).toEqual({
      addressLine1: 'FLAT 2, THORNEWILL HOUSE',
      addressLine2: '10-12 CABLE STREET',
      addressLine3: 'HOLBORN, EAST LONDON'
    })
  })

  test('returns address lines from lookup entry with no buildingName', () => {
    lookupAddress.buildingName = null
    const result = getAddressLines(lookupAddress)
    expect(result).toEqual({
      addressLine1: 'FLAT 2',
      addressLine2: '10-12 CABLE STREET',
      addressLine3: 'HOLBORN, EAST LONDON'
    })
  })

  test('returns address lines from lookup entry with no flatName', () => {
    lookupAddress.flatName = null
    const result = getAddressLines(lookupAddress)
    expect(result).toEqual({
      addressLine1: 'THORNEWILL HOUSE',
      addressLine2: '10-12 CABLE STREET',
      addressLine3: 'HOLBORN, EAST LONDON'
    })
  })

  test('returns address lines from lookup entry with no flatName or buildingName', () => {
    lookupAddress.flatName = null
    lookupAddress.buildingName = null
    const result = getAddressLines(lookupAddress)
    expect(result).toEqual({
      addressLine1: '10-12 CABLE STREET',
      addressLine2: 'HOLBORN',
      addressLine3: 'EAST LONDON'
    })
  })

  test('returns address lines from lookup entry with no buildingNumber', () => {
    lookupAddress.buildingNumberRange = null
    const result = getAddressLines(lookupAddress)
    expect(result).toEqual({
      addressLine1: 'FLAT 2, THORNEWILL HOUSE',
      addressLine2: 'CABLE STREET',
      addressLine3: 'HOLBORN, EAST LONDON'
    })
  })

  test('returns address lines from lookup entry with no dependentLocality', () => {
    lookupAddress.dependentLocality = null
    const result = getAddressLines(lookupAddress)
    expect(result).toEqual({
      addressLine1: 'FLAT 2, THORNEWILL HOUSE',
      addressLine2: '10-12 CABLE STREET',
      addressLine3: 'EAST LONDON'
    })
  })

  test('returns address lines from lookup entry with no doubleDependentLocality', () => {
    lookupAddress.doubleDependentLocality = null
    const result = getAddressLines(lookupAddress)
    expect(result).toEqual({
      addressLine1: 'FLAT 2, THORNEWILL HOUSE',
      addressLine2: '10-12 CABLE STREET',
      addressLine3: 'HOLBORN'
    })
  })

  test('returns address lines from lookup entry with no dependentLocality & doubleDependentLocality', () => {
    lookupAddress.dependentLocality = null
    lookupAddress.doubleDependentLocality = null
    const result = getAddressLines(lookupAddress)
    expect(result).toEqual({
      addressLine1: 'FLAT 2',
      addressLine2: 'THORNEWILL HOUSE',
      addressLine3: '10-12 CABLE STREET'
    })
  })

  test('returns address lines from lookup entry with no flatName or buildingName, and no dependentLocality', () => {
    lookupAddress.flatName = null
    lookupAddress.buildingName = null
    lookupAddress.dependentLocality = null
    const result = getAddressLines(lookupAddress)
    expect(result).toEqual({
      addressLine1: '10-12 CABLE STREET',
      addressLine2: 'EAST LONDON',
      addressLine3: null
    })
  })

  test('returns address lines from lookup entry with no flatName or buildingName, and no doubleDependentLocality', () => {
    lookupAddress.flatName = null
    lookupAddress.buildingName = null
    lookupAddress.doubleDependentLocality = null
    const result = getAddressLines(lookupAddress)
    expect(result).toEqual({
      addressLine1: '10-12 CABLE STREET',
      addressLine2: 'HOLBORN',
      addressLine3: null
    })
  })

  test('returns address lines from lookup entry with no flatName or buildingName, and no dependentLocality & doubleDependentLocality', () => {
    lookupAddress.flatName = null
    lookupAddress.buildingName = null
    lookupAddress.dependentLocality = null
    lookupAddress.doubleDependentLocality = null
    const result = getAddressLines(lookupAddress)
    expect(result).toEqual({
      addressLine1: '10-12 CABLE STREET',
      addressLine2: null,
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

  test('manual address with missing address2 and address3 returns null for those lines', () => {
    const address = {
      address1: '123 Manual St'
    }
    const result = getAddressLines(address)
    expect(result).toEqual({
      addressLine1: '123 Manual St',
      addressLine2: null,
      addressLine3: null
    })
  })
})
