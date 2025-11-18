const { ORGANISATION } = require('../../../app/constants/types')
const validateUpdate = require('../../../app/publishing/validate-update')
const { mockOrganisation1 } = require('../../mocks/organisation')

describe('validateUpdate for ORGANISATION', () => {
  let organisation

  beforeEach(() => {
    organisation = JSON.parse(JSON.stringify(mockOrganisation1))
    organisation.type = ORGANISATION
  })

  const optionalFields = [
    'addressLine1',
    'addressLine2',
    'addressLine3',
    'city',
    'county',
    'postcode',
    'emailAddress'
  ]

  test.each(optionalFields)('returns true if missing optional field %s', (field) => {
    delete organisation[field]
    expect(validateUpdate(organisation, ORGANISATION)).toBeTruthy()
  })

  const requiredFields = [
    'name',
    'sbi',
    'frn',
    'type',
    'updated'
  ]

  test.each(requiredFields)('returns false if missing required field %s', (field) => {
    delete organisation[field]
    expect(validateUpdate(organisation, ORGANISATION)).toBeFalsy()
  })

  test('returns true if emailAddress is invalid format', () => {
    organisation.emailAddress = 'invalid'
    expect(validateUpdate(organisation, ORGANISATION)).toBeTruthy()
  })

  test('returns true if all fields present', () => {
    expect(validateUpdate(organisation, ORGANISATION)).toBeTruthy()
  })
})
