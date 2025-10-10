const hasNonLineBasedProperties = (address) => {
  return address?.street || address?.buildingNumberRange || address?.buildingName || address?.flatName || address?.dependentLocality || address?.doubleDependentLocality
}

const countNonNullLines = (lines) => {
  return Object.values(lines).filter((line) => line && line.trim() !== '').length
}

const getNonNullLines = (lines) => {
  return Object.values(lines).filter((line) => line && line.trim() !== '')
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
    const {
      flatName = null,
      buildingName = null,
      buildingNumberRange = null,
      street = null,
      dependentLocality = null,
      doubleDependentLocality = null
    } = address

    const addressLines = {
      addressLine1: flatName,
      addressLine2: buildingName,
      addressLine3: buildingNumberRange && street ? `${buildingNumberRange} ${street}` : street || null,
      addressLine4: dependentLocality,
      addressLine5: doubleDependentLocality
    }

    if (
      countNonNullLines(addressLines) > 3 &&
      dependentLocality &&
      doubleDependentLocality
    ) {
      addressLines.addressLine4 = `${dependentLocality}, ${doubleDependentLocality}`
      addressLines.addressLine5 = null
    }

    if (
      countNonNullLines(addressLines) > 3 &&
      flatName &&
      buildingName
    ) {
      addressLines.addressLine1 = `${flatName}, ${buildingName}`
      addressLines.addressLine2 = null
    }

    const finalLines = getNonNullLines(addressLines)

    const condensedAddressLines = {}
    for (let i = 0; i < finalLines.length && i < 3; i++) {
      condensedAddressLines[`addressLine${i + 1}`] = finalLines[i]
    }

    for (let i = finalLines.length; i < 3; i++) {
      condensedAddressLines[`addressLine${i + 1}`] = null
    }

    return condensedAddressLines
  } else {
    return null
  }
}

module.exports = {
  getAddressLines
}
