const util = require('node:util')
const schema = require('./demographics-schema')
const { VALIDATION } = require('../../constants/error-categories')

const validateDemographicsData = (demographicsData) => {
  const validationResult = schema.validate(demographicsData, { abortEarly: false })
  if (validationResult.error) {
    const error = new Error(`${demographicsData} dataset is invalid, ${validationResult.error.message}`, util.inspect(demographicsData, false, null, true))
    error.category = VALIDATION
    console.error(error.message)
    throw error
  }
}

module.exports = {
  validateDemographicsData
}
