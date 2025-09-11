const { ORGANISATION } = require('../../../app/constants/types')
const validateUpdate = require('../../../app/publishing/validate-update')
const { mockOrganisation1 } = require('../../mocks/organisation')
let organisation

describe('validate update', () => {
  beforeEach(() => {
    organisation = JSON.parse(JSON.stringify(mockOrganisation1))
    organisation.type = ORGANISATION
  })

  test('returns true if valid organisation', () => {
    const result = validateUpdate(organisation, ORGANISATION)
    expect(result).toBeTruthy()
  })

  test('returns true if missing organisation address line 1', () => {
    delete organisation.addressLine1
    const result = validateUpdate(organisation, ORGANISATION)
    expect(result).toBeTruthy()
  })

  test('returns true if missing organisation address line 2', () => {
    delete organisation.addressLine2
    const result = validateUpdate(organisation, ORGANISATION)
    expect(result).toBeTruthy()
  })

  test('returns true if missing organisation address line 3', () => {
    delete organisation.addressLine3
    const result = validateUpdate(organisation, ORGANISATION)
    expect(result).toBeTruthy()
  })

  test('returns true if missing organisation city', () => {
    delete organisation.city
    const result = validateUpdate(organisation, ORGANISATION)
    expect(result).toBeTruthy()
  })

  test('returns true if missing organisation county', () => {
    delete organisation.county
    const result = validateUpdate(organisation, ORGANISATION)
    expect(result).toBeTruthy()
  })

  test('returns false if missing organisation name', () => {
    delete organisation.name
    const result = validateUpdate(organisation, ORGANISATION)
    expect(result).toBeFalsy()
  })

  test('returns false if missing organisation sbi', () => {
    delete organisation.sbi
    const result = validateUpdate(organisation, ORGANISATION)
    expect(result).toBeFalsy()
  })

  test('returns false if missing organisation frn', () => {
    delete organisation.frn
    const result = validateUpdate(organisation, ORGANISATION)
    expect(result).toBeFalsy()
  })

  test('returns true if missing organisation postcode', () => {
    delete organisation.postcode
    const result = validateUpdate(organisation, ORGANISATION)
    expect(result).toBeTruthy()
  })

  test('returns true if missing organisation email address', () => {
    delete organisation.emailAddress
    const result = validateUpdate(organisation, ORGANISATION)
    expect(result).toBeTruthy()
  })

  test('returns true if organisation email address not valid email', () => {
    organisation.emailAddress = 'invalid'
    const result = validateUpdate(organisation, ORGANISATION)
    expect(result).toBeTruthy()
  })

  test('returns false if missing organisation type', () => {
    delete organisation.type
    const result = validateUpdate(organisation, ORGANISATION)
    expect(result).toBeFalsy()
  })

  test('returns false if missing organisation updated', () => {
    delete organisation.updated
    const result = validateUpdate(organisation, ORGANISATION)
    expect(result).toBeFalsy()
  })
})
