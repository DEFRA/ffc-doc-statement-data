const { formatLookupAddress } = require('../../../app/messaging/format-lookup-address')

test('returns null for all lines when all address fields are missing', () => {
  const address = {}
  expect(formatLookupAddress(address)).toEqual({
    addressLine1: null,
    addressLine2: null,
    addressLine3: null
  })
})

test('returns pafOrganisationName as line1 and combined flatName and buildingName as line2 when all present', () => {
  const address = {
    pafOrganisationName: 'Org Ltd',
    flatName: 'Flat 1',
    buildingName: 'Building A',
    buildingNumberRange: '10-12',
    street: 'Main Street'
  }
  expect(formatLookupAddress(address)).toEqual({
    addressLine1: 'Org Ltd',
    addressLine2: 'Flat 1 Building A',
    addressLine3: '10-12 Main Street'
  })
})

test('returns pafOrganisationName as line1 and flatName as line2 when buildingName missing', () => {
  const address = {
    pafOrganisationName: 'Org Ltd',
    flatName: 'Flat 1',
    buildingNumberRange: '10',
    street: 'Main Street'
  }
  expect(formatLookupAddress(address)).toEqual({
    addressLine1: 'Org Ltd',
    addressLine2: 'Flat 1',
    addressLine3: '10 Main Street'
  })
})

test('returns pafOrganisationName as line1 and buildingName as line2 when flatName missing', () => {
  const address = {
    pafOrganisationName: 'Org Ltd',
    buildingName: 'Building A',
    buildingNumberRange: '10',
    street: 'Main Street'
  }
  expect(formatLookupAddress(address)).toEqual({
    addressLine1: 'Org Ltd',
    addressLine2: 'Building A',
    addressLine3: '10 Main Street'
  })
})

test('returns pafOrganisationName as line1 and null as line2 when flatName and buildingName missing', () => {
  const address = {
    pafOrganisationName: 'Org Ltd',
    buildingNumberRange: '10',
    street: 'Main Street'
  }
  expect(formatLookupAddress(address)).toEqual({
    addressLine1: 'Org Ltd',
    addressLine2: null,
    addressLine3: '10 Main Street'
  })
})

test('returns flatName as line1 and buildingName as line2 when pafOrganisationName missing and both flatName and buildingName present', () => {
  const address = {
    flatName: 'Flat 1',
    buildingName: 'Building A',
    buildingNumberRange: '10',
    street: 'Main Street'
  }
  expect(formatLookupAddress(address)).toEqual({
    addressLine1: 'Flat 1',
    addressLine2: 'Building A',
    addressLine3: '10 Main Street'
  })
})

test('returns flatName as line1 and null as line2 when pafOrganisationName missing and only flatName present', () => {
  const address = {
    flatName: 'Flat 1',
    buildingNumberRange: '10',
    street: 'Main Street'
  }
  expect(formatLookupAddress(address)).toEqual({
    addressLine1: 'Flat 1',
    addressLine2: null,
    addressLine3: '10 Main Street'
  })
})

test('returns buildingName as line1 and null as line2 when pafOrganisationName missing and only buildingName present', () => {
  const address = {
    buildingName: 'Building A',
    buildingNumberRange: '10',
    street: 'Main Street'
  }
  expect(formatLookupAddress(address)).toEqual({
    addressLine1: 'Building A',
    addressLine2: null,
    addressLine3: '10 Main Street'
  })
})

test('returns null for addressLine3 when buildingNumberRange and street are missing', () => {
  const address = {
    pafOrganisationName: 'Org Ltd',
    flatName: 'Flat 1',
    buildingName: 'Building A'
  }
  expect(formatLookupAddress(address)).toEqual({
    addressLine1: 'Org Ltd',
    addressLine2: 'Flat 1 Building A',
    addressLine3: null
  })
})

test('addressLine3 correctly joins buildingNumberRange and street when both present', () => {
  const address = {
    buildingNumberRange: '5-7',
    street: 'High Street'
  }
  expect(formatLookupAddress(address)).toEqual({
    addressLine1: null,
    addressLine2: null,
    addressLine3: '5-7 High Street'
  })
})

test('addressLine3 returns buildingNumberRange alone if street missing', () => {
  const address = {
    buildingNumberRange: '5-7'
  }
  expect(formatLookupAddress(address)).toEqual({
    addressLine1: null,
    addressLine2: null,
    addressLine3: '5-7'
  })
})

test('addressLine3 returns street alone if buildingNumberRange missing', () => {
  const address = {
    street: 'High Street'
  }
  expect(formatLookupAddress(address)).toEqual({
    addressLine1: null,
    addressLine2: null,
    addressLine3: 'High Street'
  })
})
