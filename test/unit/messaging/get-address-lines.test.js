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
      addressLine1: 'FLAT 2',
      addressLine2: 'THORNEWILL HOUSE',
      addressLine3: '10-12 CABLE STREET'
    })
  })

  test('returns address lines from lookup entry with no buildingName', () => {
    lookupAddress.buildingName = null
    const result = getAddressLines(lookupAddress)
    expect(result).toEqual({
      addressLine1: 'FLAT 2',
      addressLine2: '10-12 CABLE STREET',
      addressLine3: null
    })
  })

  test('returns address lines from lookup entry with no flatName', () => {
    lookupAddress.flatName = null
    const result = getAddressLines(lookupAddress)
    expect(result).toEqual({
      addressLine1: 'THORNEWILL HOUSE',
      addressLine2: '10-12 CABLE STREET',
      addressLine3: null
    })
  })

  test('returns address lines from lookup entry with no flatName or buildingName', () => {
    lookupAddress.flatName = null
    lookupAddress.buildingName = null
    const result = getAddressLines(lookupAddress)
    expect(result).toEqual({
      addressLine1: '10-12 CABLE STREET',
      addressLine2: null,
      addressLine3: null
    })
  })

  test('returns address lines from lookup entry with no buildingNumber', () => {
    lookupAddress.buildingNumberRange = null
    const result = getAddressLines(lookupAddress)
    expect(result).toEqual({
      addressLine1: 'FLAT 2',
      addressLine2: 'THORNEWILL HOUSE',
      addressLine3: 'CABLE STREET'
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

  test('manual address with missing address1 and address3 returns just address2 into line1', () => {
    const address = {
      address2: '123 Manual St'
    }
    const result = getAddressLines(address)
    expect(result).toEqual({
      addressLine1: '123 Manual St',
      addressLine2: null,
      addressLine3: null
    })
  })

  test('manual address with missing address1 and address2 returns just address3 into line1', () => {
    const address = {
      address3: '123 Manual St'
    }
    const result = getAddressLines(address)
    expect(result).toEqual({
      addressLine1: '123 Manual St',
      addressLine2: null,
      addressLine3: null
    })
  })
})
