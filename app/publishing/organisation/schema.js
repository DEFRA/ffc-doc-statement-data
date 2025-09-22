const Joi = require('joi')
const commonSchemas = require('./commonSchemas') // Adjust the path accordingly
const { ORGANISATION } = require('../../constants/types')

module.exports = Joi.object({
  name: commonSchemas.name(),
  sbi: commonSchemas.sbi(),
  frn: commonSchemas.frn(),
  addressLine1: commonSchemas.addressLine(1),
  addressLine2: commonSchemas.addressLine(2),
  addressLine3: commonSchemas.addressLine(3),
  city: commonSchemas.city(),
  county: commonSchemas.county(),
  postcode: commonSchemas.postcode(),
  emailAddress: commonSchemas.emailAddress(),
  updated: commonSchemas.updated(),
  type: Joi.string().required().valid(ORGANISATION).messages({
    'string.base': 'type should be a type of string',
    'any.required': 'The field type is not present but it is required',
    'any.only': `type must be : ${ORGANISATION}`
  })
})
