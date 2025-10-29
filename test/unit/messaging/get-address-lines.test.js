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

  test('returns address lines from lookup entry with pafOrganisationName present combining flatName and buildingName', () => {
    lookupAddress.pafOrganisationName = 'ORG LTD'
    lookupAddress.flatName = 'FLAT 2'
    lookupAddress.buildingName = 'THORNEWILL HOUSE'
    lookupAddress.buildingNumberRange = '10-12'
    lookupAddress.street = 'CABLE STREET'
    const result = getAddressLines(lookupAddress)
    expect(result).toEqual({
      addressLine1: 'ORG LTD',
      addressLine2: 'FLAT 2 THORNEWILL HOUSE',
      addressLine3: '10-12 CABLE STREET'
    })
  })

  test('returns address lines from lookup entry with pafOrganisationName only', () => {
    lookupAddress.pafOrganisationName = 'ORG LTD'
    lookupAddress.flatName = null
    lookupAddress.buildingName = null
    lookupAddress.buildingNumberRange = '10-12'
    lookupAddress.street = 'CABLE STREET'
    const result = getAddressLines(lookupAddress)
    expect(result).toEqual({
      addressLine1: 'ORG LTD',
      addressLine2: '10-12 CABLE STREET',
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

  test('manual entry address lines with empty strings are filtered out and null padded', () => {
    const address = {
      address1: '',
      address2: 'Line 2',
      address3: ''
    }
    const result = getAddressLines(address)
    expect(result).toEqual({
      addressLine1: 'Line 2',
      addressLine2: null,
      addressLine3: null
    })
  })

  test('postcode lookup with empty strings in flatName/buildingName handled correctly', () => {
    const address = {
      flatName: 'Flat 1',
      buildingName: '',
      buildingNumberRange: '12',
      street: 'Street Name'
    }
    const result = getAddressLines(address)
    expect(result).toEqual({
      addressLine1: 'Flat 1',
      addressLine2: '12 Street Name',
      addressLine3: null
    })
  })

  test('postcode lookup with pafOrganisationName null but both flatName and buildingName present splits lines', () => {
    const address = {
      pafOrganisationName: null,
      flatName: 'Flat 1',
      buildingName: 'Building A',
      buildingNumberRange: '12',
      street: 'Street Name'
    }
    const result = getAddressLines(address)
    expect(result).toEqual({
      addressLine1: 'Flat 1',
      addressLine2: 'Building A',
      addressLine3: '12 Street Name'
    })
  })

  test('postcode lookup with pafOrganisationName present but flatName missing and buildingName present', () => {
    const address = {
      pafOrganisationName: 'Org Ltd',
      flatName: null,
      buildingName: 'Building A',
      buildingNumberRange: '12',
      street: 'Street Name'
    }
    const result = getAddressLines(address)
    expect(result).toEqual({
      addressLine1: 'Org Ltd',
      addressLine2: 'Building A',
      addressLine3: '12 Street Name'
    })
  })

  test('postcode lookup with pafOrganisationName present but flatName present and buildingName missing', () => {
    const address = {
      pafOrganisationName: 'Org Ltd',
      flatName: 'Flat 1',
      buildingName: null,
      buildingNumberRange: '12',
      street: 'Street Name'
    }
    const result = getAddressLines(address)
    expect(result).toEqual({
      addressLine1: 'Org Ltd',
      addressLine2: 'Flat 1',
      addressLine3: '12 Street Name'
    })
  })
})
