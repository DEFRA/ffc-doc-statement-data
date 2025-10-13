const firstLineIndex = 0
const secondLineIndex = 1
const thirdLineIndex = 2
const totalAddressLines = 3

const isManualEntry = (address) => {
  return address?.address1 || address?.address2 || address?.address3
}

const isPostcodeLookup = (address) => {
  return address?.street || address?.buildingNumberRange || address?.buildingName || address?.flatName || address?.dependentLocality || address?.doubleDependentLocality
}

const getAddressLine3 = (buildingNumberRange, street) => {
  return (buildingNumberRange || street)
    ? [buildingNumberRange, street].filter(Boolean).join(' ')
    : null
}

const bumpAddressLines = (addressLines) => {
  let linesAsArray = [addressLines.addressLine1, addressLines.addressLine2, addressLines.addressLine3]

  linesAsArray = linesAsArray.filter((line) => line !== null && line !== undefined && line !== '')

  while (linesAsArray.length < totalAddressLines) {
    linesAsArray.push(null)
  }

  return {
    addressLine1: linesAsArray[firstLineIndex],
    addressLine2: linesAsArray[secondLineIndex],
    addressLine3: linesAsArray[thirdLineIndex]
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
    return bumpAddressLines({
      addressLine1: address.flatName ?? null,
      addressLine2: address.buildingName ?? null,
      addressLine3: getAddressLine3(address.buildingNumberRange, address.street)
    })
  } else {
    return null
  }
}

module.exports = {
  getAddressLines
}
