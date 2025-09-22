const Joi = require('joi')
const { ORGANISATION } = require('../../constants/types')
const commonSchemas = require('../../constants/common-schemas')

const one = 1
const two = 2
const three = 3

module.exports = Joi.object({
  name: commonSchemas.name(),
  sbi: commonSchemas.sbi(),
  frn: commonSchemas.frn(),
  addressLine1: commonSchemas.addressLine(one),
  addressLine2: commonSchemas.addressLine(two),
  addressLine3: commonSchemas.addressLine(three),
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
