const removeNullPropertiesExceptCalculationId = (obj) => {
  return JSON.parse(JSON.stringify(obj, (key, value) => {
    // Check if value is null or if key ends with 'Id' but is not 'calculationId' or 'applicationId'
    if (value === null || (key.endsWith('Id') && !['calculationId', 'applicationId'].includes(key))) {
      return undefined
    }
    return value
  }))
}

module.exports = removeNullPropertiesExceptCalculationId
