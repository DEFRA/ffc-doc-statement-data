const { formatLookupAddress } = require('./format-lookup-address')

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
    return bumpAddressLines(formatLookupAddress(address))
  } else {
    return null
  }
}

module.exports = {
  getAddressLines
}
