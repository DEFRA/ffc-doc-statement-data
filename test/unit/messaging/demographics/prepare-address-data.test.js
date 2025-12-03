const { prepareAddressData } = require('../../../../app/messaging/demographics/prepare-address-data')
const { getAddressLines } = require('../../../../app/messaging/demographics/get-address-lines')

jest.mock('../../../../app/messaging/demographics/get-address-lines', () => ({
  getAddressLines: jest.fn()
}))

describe('prepareAddressData', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should return all null fields when addressObj is null', () => {
    const result = prepareAddressData(null)
    expect(result).toEqual({
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      city: null,
      county: null,
      postcode: null
    })
  })

  test('should return all null fields when addressObj is undefined', () => {
    const result = prepareAddressData(undefined)
    expect(result).toEqual({
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      city: null,
      county: null,
      postcode: null
    })
  })

  test('should combine getAddressLines output with city, county, and postcode', () => {
    const mockAddress = {
      city: 'Test City',
      county: 'Test County',
      postalCode: 'AB12 3CD'
    }

    // Mock getAddressLines to return some lines
    getAddressLines.mockReturnValue({
      addressLine1: '123 Test St',
      addressLine2: 'Suite 4',
      addressLine3: null
    })

    const result = prepareAddressData(mockAddress)

    expect(getAddressLines).toHaveBeenCalledWith(mockAddress)
    expect(result).toEqual({
      addressLine1: '123 Test St',
      addressLine2: 'Suite 4',
      addressLine3: null,
      city: 'Test City',
      county: 'Test County',
      postcode: 'AB12 3CD'
    })
  })

  test('should default city, county, and postcode to null if missing', () => {
    const mockAddress = {}

    getAddressLines.mockReturnValue({
      addressLine1: 'Line 1',
      addressLine2: null,
      addressLine3: null
    })

    const result = prepareAddressData(mockAddress)

    expect(result).toEqual({
      addressLine1: 'Line 1',
      addressLine2: null,
      addressLine3: null,
      city: null,
      county: null,
      postcode: null
    })
  })
})
