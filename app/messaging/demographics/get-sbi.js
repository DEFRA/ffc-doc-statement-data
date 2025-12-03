const getSBI = (data) => {
  if (data.organisation?.sbi) {
    return data?.organisation?.sbi
  } else {
    return findFromLegacyIdentifiers(data.legacyIdentifier)
  }
}

const findFromLegacyIdentifiers = (array) => {
  if (!array) {
    return null
  }
  // Check if any element in the array has specific type SBI
  // File format has sbi/trader/vendor in both org and legacyIdentifier section - this will catch as failsafe if missing from org
  const sbi = array.find(element => element && element.type === 'SBI')
  return sbi ? sbi.value : null
}

module.exports = {
  getSBI
}
