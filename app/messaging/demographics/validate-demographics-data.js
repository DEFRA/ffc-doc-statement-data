const schema = require('./demographics-schema')
const { VALIDATION } = require('../../constants/error-categories')

const validateDemographicsData = (demographicsData) => {
  const validationResult = schema.validate(demographicsData, { abortEarly: false })
  if (validationResult.error) {
    const error = new Error(`Demographics dataset is invalid: ${validationResult.error.message}`)
    error.category = VALIDATION
    console.error(`Demographics dataset is invalid for sbi ${demographicsData.sbi}, frn ${demographicsData.frn}: ${validationResult.error.message}`)
    throw error
  }
}

module.exports = {
  validateDemographicsData
}
