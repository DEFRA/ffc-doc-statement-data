const Joi = require('joi')
const { ORGANISATION } = require('../types')

const MIN_SBI = 105000000
const MAX_SBI = 999999999
const MIN_FRN = 1000000000
const MAX_FRN = 9999999999

module.exports = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'name should be a type of string',
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
  addressLine1: Joi.string().optional().messages({
    'string.base': 'addressLine1 should be a type of string'
  }),
  addressLine2: Joi.string().optional().messages({
    'string.base': 'addressLine2 should be a type of string'
  }),
  addressLine3: Joi.string().optional().messages({
    'string.base': 'addressLine3 should be a type of string'
  }),
  city: Joi.string().optional().messages({
    'string.base': 'city should be a type of string'
  }),
  county: Joi.string().optional().messages({
    'string.base': 'county should be a type of string'
  }),
  postcode: Joi.string().optional().messages({
    'string.base': 'postcode should be a type of string'
  }),
  emailAddress: Joi.string().optional().messages({
    'string.base': 'emailAddress should be a type of string'
  }),
  updated: Joi.date().required().messages({
    'date.base': 'updated should be a type of date',
    'any.required': 'The field updated is not present but it is required'
  }),
  type: Joi.string().required().allow(ORGANISATION).messages({
    'string.base': 'type should be a type of string',
    'any.required': 'The field type is not present but it is required',
    'any.only': `type must be : ${ORGANISATION}`
  })
})
