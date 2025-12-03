const { getAddressLines } = require('./get-address-lines')

const prepareAddressData = (addressObj) => {
  if (!addressObj) {
    return {
      addressLine1: null,
      addressLine2: null,
      addressLine3: null,
      city: null,
      county: null,
      postcode: null
    }
  }

  return {
    ...getAddressLines(addressObj),
    city: addressObj.city || null,
    county: addressObj.county || null,
    postcode: addressObj.postalCode || null
  }
}

module.exports = { prepareAddressData }
