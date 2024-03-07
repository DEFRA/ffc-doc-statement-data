const Joi = require('joi')
const { ORGANISATION } = require('../types')
const minSbi = 105000000
const minFrn = 1000000000
const maxSbiFrn = 999999999

module.exports = Joi.object({
  name: Joi.string().required(),
  sbi: Joi.number().integer().min(minSbi).max(maxSbiFrn).required(),
  frn: Joi.number().integer().min(minFrn).max(maxSbiFrn).required(),
  addressLine1: Joi.string().optional(),
  addressLine2: Joi.string().optional(),
  addressLine3: Joi.string().optional(),
  city: Joi.string().optional(),
  county: Joi.string().optional(),
  postcode: Joi.string().optional(),
  emailAddress: Joi.string().optional(),
  updated: Joi.date().required(),
  type: Joi.string().required().allow(ORGANISATION)
})
