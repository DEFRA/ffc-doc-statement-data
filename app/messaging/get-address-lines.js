const isManualEntry = (address) => {
  return address?.address1 || address?.address2 || address?.address3
}

const isPostcodeLookup = (address) => {
  return address?.street || address?.buildingNumberRange || address?.buildingName || address?.flatName || address?.dependentLocality || address?.doubleDependentLocality
}

const bumpAddressLines = (addressLines) => {
  let linesAsArray = [addressLines.addressLine1, addressLines.addressLine2, addressLines.addressLine3]

  linesAsArray = linesAsArray.filter((line) => line !== null && line !== undefined && line !== '')

  while (linesAsArray.length < 3) {
    linesAsArray.push(null)
  }

  return {
    addressLine1: linesAsArray[0],
    addressLine2: linesAsArray[1],
    addressLine3: linesAsArray[2]
  }
}

const getAddressLines = (address) => {
  if (isManualEntry(address)) {
    return bumpAddressLines({
      addressLine1: address.address1 ?? null,
      addressLine2: address.address2 ?? null,
      addressLine3: address.address3 ?? null
    })
  } else if (isPostcodeLookup(address)) {
    const {
      flatName = null,
      buildingName = null,
      buildingNumberRange = null,
      street = null
    } = address

    return bumpAddressLines({
      addressLine1: flatName,
      addressLine2: buildingName,
      addressLine3: buildingNumberRange && street ? `${buildingNumberRange} ${street}` : street || null
    })
  } else {
    return null
  }
}

module.exports = {
  getAddressLines
}
