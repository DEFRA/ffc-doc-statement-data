const { formatLookupAddress } = require('../../../../app/messaging/demographics/format-lookup-address')

describe('formatLookupAddress', () => {
  test.each([
    [{}, { addressLine1: null, addressLine2: null, addressLine3: null }],
    [
      {
        pafOrganisationName: 'Org Ltd',
        flatName: 'Flat 1',
        buildingName: 'Building A',
        buildingNumberRange: '10-12',
        street: 'Main Street'
      },
      {
        addressLine1: 'Org Ltd',
        addressLine2: 'Flat 1 Building A',
        addressLine3: '10-12 Main Street'
      }
    ],
    [
      {
        pafOrganisationName: 'Org Ltd',
        flatName: 'Flat 1',
        buildingNumberRange: '10',
        street: 'Main Street'
      },
      {
        addressLine1: 'Org Ltd',
        addressLine2: 'Flat 1',
        addressLine3: '10 Main Street'
      }
    ],
    [
      {
        pafOrganisationName: 'Org Ltd',
        buildingName: 'Building A',
        buildingNumberRange: '10',
        street: 'Main Street'
      },
      {
        addressLine1: 'Org Ltd',
        addressLine2: 'Building A',
        addressLine3: '10 Main Street'
      }
    ],
    [
      {
        pafOrganisationName: 'Org Ltd',
        buildingNumberRange: '10',
        street: 'Main Street'
      },
      {
        addressLine1: 'Org Ltd',
        addressLine2: null,
        addressLine3: '10 Main Street'
      }
    ],
    [
      {
        flatName: 'Flat 1',
        buildingName: 'Building A',
        buildingNumberRange: '10',
        street: 'Main Street'
      },
      {
        addressLine1: 'Flat 1',
        addressLine2: 'Building A',
        addressLine3: '10 Main Street'
      }
    ],
    [
      {
        flatName: 'Flat 1',
        buildingNumberRange: '10',
        street: 'Main Street'
      },
      {
        addressLine1: 'Flat 1',
        addressLine2: null,
        addressLine3: '10 Main Street'
      }
    ],
    [
      {
        buildingName: 'Building A',
        buildingNumberRange: '10',
        street: 'Main Street'
      },
      {
        addressLine1: 'Building A',
        addressLine2: null,
        addressLine3: '10 Main Street'
      }
    ],
    [
      {
        pafOrganisationName: 'Org Ltd',
        flatName: 'Flat 1',
        buildingName: 'Building A'
      },
      {
        addressLine1: 'Org Ltd',
        addressLine2: 'Flat 1 Building A',
        addressLine3: null
      }
    ],
    [
      { buildingNumberRange: '5-7', street: 'High Street' },
      { addressLine1: null, addressLine2: null, addressLine3: '5-7 High Street' }
    ],
    [{ buildingNumberRange: '5-7' }, { addressLine1: null, addressLine2: null, addressLine3: '5-7' }],
    [{ street: 'High Street' }, { addressLine1: null, addressLine2: null, addressLine3: 'High Street' }]
  ])('formats address %o correctly', (input, expected) => {
    expect(formatLookupAddress(input)).toEqual(expected)
  })
})
