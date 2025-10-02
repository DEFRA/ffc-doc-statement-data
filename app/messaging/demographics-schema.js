const Joi = require('joi')
module.exports = Joi.object({
  sbi: Joi.string().required(),
  city: Joi.string().allow(null, ''),
  county: Joi.string().allow(null, ''),
  postcode: Joi.string().allow(null, ''),
  emailAddress: Joi.string().email().allow(null, ''),
  frn: Joi.string().allow(null, ''),
  name: Joi.string().allow(null, ''),
  updated: Joi.string().required(),
  published: Joi.any().allow(null),
  addressLine1: Joi.string().allow(null, ''),
  addressLine2: Joi.string().allow(null, ''),
  addressLine3: Joi.string().allow(null, '')
}).required()
