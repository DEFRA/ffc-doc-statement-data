const { getAddressLines } = require('../../../app/messaging/get-address-lines')

describe('getAddressLines', () => {
  const testCases = [
    {
      name: 'returns address lines from manual entry',
      input: { address1: 'Address line 1 Manual', address2: 'Address line 2 Manual', address3: 'Address line 3 Manual' },
      expected: { addressLine1: 'Address line 1 Manual', addressLine2: 'Address line 2 Manual', addressLine3: 'Address line 3 Manual' }
    },
    {
      name: 'returns address lines from lookup entry if all fields present',
      input: { pafOrganisationName: 'FLAT 2', flatName: 'THORNEWILL HOUSE', buildingName: '10-12 CABLE STREET', buildingNumberRange: '', street: '' },
      expected: { addressLine1: 'FLAT 2', addressLine2: 'THORNEWILL HOUSE', addressLine3: '10-12 CABLE STREET' }
    },
    {
      name: 'returns address lines from lookup entry with no buildingName',
      input: { pafOrganisationName: 'FLAT 2', flatName: null, buildingName: null, buildingNumberRange: '10-12', street: 'CABLE STREET' },
      expected: { addressLine1: 'FLAT 2', addressLine2: '10-12 CABLE STREET', addressLine3: null }
    },
    {
      name: 'returns address lines from lookup entry with no flatName',
      input: { pafOrganisationName: 'THORNEWILL HOUSE', flatName: null, buildingName: 'THORNEWILL HOUSE', buildingNumberRange: '10', street: 'Main Street' },
      expected: { addressLine1: 'THORNEWILL HOUSE', addressLine2: '10-12 CABLE STREET', addressLine3: null }
    },
    {
      name: 'returns address lines from lookup entry with no flatName or buildingName',
      input: { pafOrganisationName: '10-12 CABLE STREET', flatName: null, buildingName: null, buildingNumberRange: '10', street: 'Main Street' },
      expected: { addressLine1: '10-12 CABLE STREET', addressLine2: null, addressLine3: null }
    },
    {
      name: 'returns null for empty address',
      input: {},
      expected: { addressLine1: null, addressLine2: null, addressLine3: null }
    },
    {
      name: 'returns null when address is null',
      input: null,
      expected: null
    },
    {
      name: 'returns null when address is undefined',
      input: undefined,
      expected: null
    },
    {
      name: 'manual address with missing address2 and address3 returns null for those lines',
      input: { address1: '123 Manual St' },
      expected: { addressLine1: '123 Manual St', addressLine2: null, addressLine3: null }
    },
    {
      name: 'manual address with missing address1 and address3 returns just address2 into line1',
      input: { address2: '123 Manual St' },
      expected: { addressLine1: '123 Manual St', addressLine2: null, addressLine3: null }
    },
    {
      name: 'manual address with missing address1 and address2 returns just address3 into line1',
      input: { address3: '123 Manual St' },
      expected: { addressLine1: '123 Manual St', addressLine2: null, addressLine3: null }
    },
    {
      name: 'manual entry address lines with empty strings are filtered out and null padded',
      input: { address1: '', address2: 'Line 2', address3: '' },
      expected: { addressLine1: 'Line 2', addressLine2: null, addressLine3: null }
    },
    {
      name: 'postcode lookup with empty strings in flatName/buildingName handled correctly',
      input: { flatName: 'Flat 1', buildingName: '', buildingNumberRange: '12', street: 'Street Name' },
      expected: { addressLine1: 'Flat 1', addressLine2: '12 Street Name', addressLine3: null }
    },
    {
      name: 'postcode lookup with pafOrganisationName null but both flatName and buildingName present splits lines',
      input: { pafOrganisationName: null, flatName: 'Flat 1', buildingName: 'Building A', buildingNumberRange: '12', street: 'Street Name' },
      expected: { addressLine1: 'Flat 1', addressLine2: 'Building A', addressLine3: '12 Street Name' }
    },
    {
      name: 'postcode lookup with pafOrganisationName present but flatName missing and buildingName present',
      input: { pafOrganisationName: 'Org Ltd', flatName: null, buildingName: 'Building A', buildingNumberRange: '12', street: 'Street Name' },
      expected: { addressLine1: 'Org Ltd', addressLine2: 'Building A', addressLine3: '12 Street Name' }
    },
    {
      name: 'postcode lookup with pafOrganisationName present but flatName present and buildingName missing',
      input: { pafOrganisationName: 'Org Ltd', flatName: 'Flat 1', buildingName: null, buildingNumberRange: '12', street: 'Street Name' },
      expected: { addressLine1: 'Org Ltd', addressLine2: 'Flat 1', addressLine3: '12 Street Name' }
    },
    {
      name: 'returns address lines from lookup entry with pafOrganisationName present combining flatName and buildingName',
      input: { pafOrganisationName: 'ORG LTD', flatName: 'FLAT 2', buildingName: 'THORNEWILL HOUSE', buildingNumberRange: '10-12', street: 'CABLE STREET' },
      expected: { addressLine1: 'ORG LTD', addressLine2: 'FLAT 2 THORNEWILL HOUSE', addressLine3: '10-12 CABLE STREET' }
    },
    {
      name: 'returns address lines from lookup entry with pafOrganisationName only',
      input: { pafOrganisationName: 'ORG LTD', flatName: null, buildingName: null, buildingNumberRange: '10-12', street: 'CABLE STREET' },
      expected: { addressLine1: 'ORG LTD', addressLine2: '10-12 CABLE STREET', addressLine3: null }
    },
    {
      name: 'returns address lines from lookup entry with no buildingNumber',
      input: { flatName: 'FLAT 2', buildingName: 'THORNEWILL HOUSE', buildingNumberRange: null, street: 'CABLE STREET' },
      expected: { addressLine1: 'FLAT 2', addressLine2: 'THORNEWILL HOUSE', addressLine3: 'CABLE STREET' }
    }
  ]

  test.each(testCases)('$name', ({ input, expected }) => {
    expect(getAddressLines(input)).toEqual(expected)
  })
})
