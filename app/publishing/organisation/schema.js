const Joi = require('joi')
const { ORGANISATION } = require('../../constants/types')

const MIN_SBI = 105000000
const MAX_SBI = 999999999
const MIN_FRN = 1000000000
const MAX_FRN = 9999999999
const MAX_NAME_LENGTH = 160
const MAX_ADDRESS_LINE_LENGTH = 240
const MAX_CITY_COUNTY_LENGTH = 127
const MAX_POSTCODE_LENGTH = 8
const MAX_EMAIL_LENGTH = 260

module.exports = Joi.object({
  name: Joi.string().max(MAX_NAME_LENGTH).required().messages({
    'string.base': 'name should be a type of string',
    'string.max': `name should have a maximum length of ${MAX_NAME_LENGTH}`,
    'any.required': 'The field name is not present but it is required'
  }),
  sbi: Joi.number().integer().min(MIN_SBI).max(MAX_SBI).required().messages({
    'number.base': 'sbi should be a type of number',
    'number.integer': 'sbi should be an integer',
    'number.min': `sbi should have a minimum value of ${MIN_SBI}`,
    'number.max': `sbi should have a maximum value of ${MAX_SBI}`,
    'any.required': 'The field sbi is not present but it is required'
  }),
  frn: Joi.number().integer().min(MIN_FRN).max(MAX_FRN).required().messages({
    'number.base': 'frn should be a type of number',
    'number.integer': 'frn should be an integer',
    'number.min': `frn should have a minimum value of ${MIN_FRN}`,
    'number.max': `frn should have a maximum value of ${MAX_FRN}`,
    'any.required': 'The field frn is not present but it is required'
  }),
  addressLine1: Joi.string().max(MAX_ADDRESS_LINE_LENGTH).optional().allow('').messages({
    'string.base': 'addressLine1 should be a type of string',
    'string.max': `addressLine1 should have a maximum length of ${MAX_ADDRESS_LINE_LENGTH}`
  }),
  addressLine2: Joi.string().max(MAX_ADDRESS_LINE_LENGTH).optional().allow('').messages({
    'string.base': 'addressLine2 should be a type of string',
    'string.max': `addressLine2 should have a maximum length of ${MAX_ADDRESS_LINE_LENGTH}`
  }),
  addressLine3: Joi.string().max(MAX_ADDRESS_LINE_LENGTH).optional().allow('').messages({
    'string.base': 'addressLine3 should be a type of string',
    'string.max': `addressLine3 should have a maximum length of ${MAX_ADDRESS_LINE_LENGTH}`
  }),
  city: Joi.string().max(MAX_CITY_COUNTY_LENGTH).optional().allow('').messages({
    'string.base': 'city should be a type of string',
    'string.max': `city should have a maximum length of ${MAX_CITY_COUNTY_LENGTH}`
  }),
  county: Joi.string().max(MAX_CITY_COUNTY_LENGTH).optional().allow('').messages({
    'string.base': 'county should be a type of string',
    'string.max': `county should have a maximum length of ${MAX_CITY_COUNTY_LENGTH}`
  }),
  postcode: Joi.string().max(MAX_POSTCODE_LENGTH).optional().allow('').messages({
    'string.base': 'postcode should be a type of string',
    'string.max': `postcode should have a maximum length of ${MAX_POSTCODE_LENGTH}`
  }),
  emailAddress: Joi.string().max(MAX_EMAIL_LENGTH).optional().allow('').messages({
    'string.base': 'emailAddress should be a type of string',
    'string.max': `emailAddress should have a maximum length of ${MAX_EMAIL_LENGTH}`
  }),
  updated: Joi.date().required().messages({
    'date.base': 'updated should be a type of date',
    'any.required': 'The field updated is not present but it is required'
  }),
  type: Joi.string().required().valid(ORGANISATION).messages({
    'string.base': 'type should be a type of string',
    'any.required': 'The field type is not present but it is required',
    'any.only': `type must be : ${ORGANISATION}`
  })
})
