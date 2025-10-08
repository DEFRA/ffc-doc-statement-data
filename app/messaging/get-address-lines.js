const hasNonLineBasedProperties = (address) => {
  return address?.street || address?.buildingNumberRange || address?.buildingName || address?.flatName
}

const getAddressLines = (address) => {
  // address can be either entered manually or provided via lookup
  // this affects how address is provided.
  if (address?.address1) {
    return {
      addressLine1: address.address1 ?? null,
      addressLine2: address.address2 ?? null,
      addressLine3: address.address3 ?? null
    }
  } else if (hasNonLineBasedProperties(address)) {
    const flatName = address.flatName
    const buildingName = address.buildingName
    const buildingNumber = address.buildingNumberRange
    const street = address.street
    return {
      addressLine1: (flatName && buildingName ? `${flatName} ${buildingName}` : (flatName ?? buildingName)) ?? null,
      addressLine2: (buildingNumber ? `${buildingNumber} ${street}` : street) ?? null,
      addressLine3: null
    }
  } else {
    return null
  }
}

module.exports = {
  getAddressLines
}
