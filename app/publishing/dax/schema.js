const Joi = require('joi')
const { DAX } = require('../types')
const number30 = 30
const number200 = 200

module.exports = Joi.object({
  paymentReference: Joi.string().max(number30).required().messages({
    'string.base': 'paymentReference should be a type of string',
    'string.max': `paymentReference should have a maximum length of ${number30}`,
    'any.required': 'The field paymentReference is not present but it is required'
  }),
  calculationReference: Joi.number().integer().messages({
    'number.base': 'calculationReference should be a type of number',
    'number.integer': 'calculationReference should be an integer'
  }),
  paymentPeriod: Joi.string().max(number200).allow('', null).optional().messages({
    'string.base': 'paymentPeriod should be a type of string',
    'string.max': `paymentPeriod should have a maximum length of ${number200}`,
    'any.allowOnly': 'paymentPeriod can only be empty string or null'
  }),
  paymentAmount: Joi.number().required().messages({
    'number.base': 'paymentAmount should be a type of number',
    'any.required': 'The field paymentAmount is not present but it is required'
  }),
  transactionDate: Joi.date().required().messages({
    'date.base': 'transactionDate should be a type of date',
    'any.required': 'The field transactionDate is not present but it is required'
  }),
  datePublished: Joi.date().messages({
    'date.base': 'datePublished should be a type of date'
  }),
  type: Joi.string().required().allow(DAX).messages({
    'string.base': 'type should be a type of string',
    'any.required': 'The field type is not present but it is required',
    'any.only': `type must be : ${DAX}`
  })
})
