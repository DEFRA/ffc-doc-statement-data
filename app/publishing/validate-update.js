const validateUpdate = (update, type) => {
  const schema = require(`./${type}/schema`)
  const validationResult = schema.validate(update, { abortEarly: false })
  if (validationResult.error) {
    console.error(`${type} dataset is invalid: ${validationResult.error.message}`)
    return false
  }
  return true
}

module.exports = validateUpdate
