const Joi = require('joi')
const commonSchemas = require('../constants/common-schemas')

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
  updated: commonSchemas.updated()
})
