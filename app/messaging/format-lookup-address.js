const getAddressLine3 = (buildingNumberRange, street) => {
  return (buildingNumberRange || street)
    ? [buildingNumberRange, street].filter(Boolean).join(' ')
    : null
}

const formatLookupAddress = address => {
  const {
    pafOrganisationName = null,
    flatName = null,
    buildingName = null,
    buildingNumberRange = null,
    street = null
  } = address

  const addressLine3 = getAddressLine3(buildingNumberRange, street) || null

  if (pafOrganisationName) {
    return {
      addressLine1: pafOrganisationName,
      addressLine2: [flatName, buildingName].filter(Boolean).join(' ') || null,
      addressLine3
    }
  }

  const lineParts = [flatName, buildingName].filter(Boolean)

  if (lineParts.length === 2) {
    return {
      addressLine1: lineParts[0],
      addressLine2: lineParts[1],
      addressLine3
    }
  }

  return {
    addressLine1: lineParts[0] || null,
    addressLine2: null,
    addressLine3
  }
}

module.exports = {
  formatLookupAddress
}
