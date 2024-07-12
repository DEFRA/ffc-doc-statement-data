const getAddressLines = (address) => {
  // address can be either entered manually or provided via lookup
  // this affects how address is provided.
  if (address?.address1) {
    return {
      addressLine1: address.address1,
      addressLine2: address.address2,
      addressLine3: address.address3
    }
  } else if (address?.street) {
    const flatName = address.flatName
    const buildingName = address.buildingName
    const buildingNumber = address.buildingNumberRange
    const street = address.street
    return {
      addressLine1: flatName && buildingName ? `${flatName} ${buildingName}` : (flatName ?? buildingName),
      addressLine2: buildingNumber ? `${buildingNumber} ${street}` : street,
      addressLine3: null
    }
  }
  return null
}

module.exports = {
  getAddressLines
}
