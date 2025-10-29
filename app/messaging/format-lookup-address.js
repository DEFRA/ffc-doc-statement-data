const getAddressLine3 = (buildingNumberRange, street) => {
  return (buildingNumberRange || street)
    ? [buildingNumberRange, street].filter(Boolean).join(' ')
    : null
}

const formatLookupAddress = (address) => {
  const {
    pafOrganisationName = null,
    flatName = null,
    buildingName = null,
    buildingNumberRange = null,
    street = null
  } = address

  let addressLine1 = null
  let addressLine2 = null
  const addressLine3 = getAddressLine3(buildingNumberRange, street) || null

  if (pafOrganisationName) {
    addressLine1 = pafOrganisationName

    if (flatName && buildingName) {
      addressLine2 = `${flatName} ${buildingName}`
    } else if (flatName) {
      addressLine2 = flatName
    } else if (buildingName) {
      addressLine2 = buildingName
    } else {
      addressLine2 = null
    }
  } else {
    if (flatName && buildingName) {
      addressLine1 = flatName
      addressLine2 = buildingName
    } else if (flatName) {
      addressLine1 = flatName
      addressLine2 = null
    } else if (buildingName) {
      addressLine1 = buildingName
      addressLine2 = null
    } else {
      addressLine1 = null
      addressLine2 = null
    }
  }

  return {
    addressLine1,
    addressLine2,
    addressLine3
  }
}

module.exports = {
  formatLookupAddress
}
