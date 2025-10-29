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

  let addressLine1 = null
  let addressLine2 = null

  if (pafOrganisationName) {
    addressLine1 = pafOrganisationName
    addressLine2 = flatName && buildingName
      ? `${flatName} ${buildingName}`
      : flatName || buildingName || null
  } else if (flatName && buildingName) {
    addressLine1 = flatName
    addressLine2 = buildingName
  } else {
    addressLine1 = flatName || buildingName || null
    addressLine2 = null
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
