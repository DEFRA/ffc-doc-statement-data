const Joi = require('joi')
const { D365 } = require('../../constants/types')

const paymentReferenceChars = 30
const paymentPeriodChars = 200
const marketingYearChars = 9999

// Common message definitions
const stringBaseMessage = (field) => `${field} should be a type of string`
const numberBaseMessage = (field) => `${field} should be a type of number`
const requiredMessage = (field) => `The field ${field} is not present but it is required`
const maxLengthMessage = (field, length) => `${field} should have a maximum length of ${length}`
const integerMessage = (field) => `${field} should be an integer`
const dateBaseMessage = (field) => `${field} should be a type of date`
const typeOnlyMessage = (field, type) => `${field} must be : ${type}`

module.exports = Joi.object({
  paymentReference: Joi.string().max(paymentReferenceChars).required().messages({
    'string.base': stringBaseMessage('paymentReference'),
    'string.max': maxLengthMessage('paymentReference', paymentReferenceChars),
    'any.required': requiredMessage('paymentReference')
  }),
  calculationReference: Joi.number().integer().messages({
    'number.base': numberBaseMessage('calculationReference'),
    'number.integer': integerMessage('calculationReference')
  }),
  marketingYear: Joi.number().integer().max(marketingYearChars).required().messages({
    'number.base': integerMessage('marketingYear'),
    'number.max': maxLengthMessage('marketingYear', marketingYearChars)
  }),
  paymentPeriod: Joi.string().max(paymentPeriodChars).required().messages({
    'string.base': stringBaseMessage('paymentPeriod'),
    'string.max': maxLengthMessage('paymentPeriod', paymentPeriodChars),
    'any.required': requiredMessage('paymentPeriod')
  }),
  paymentAmount: Joi.number().required().messages({
    'number.base': numberBaseMessage('paymentAmount'),
    'any.required': requiredMessage('paymentAmount')
  }),
  transactionDate: Joi.date().required().messages({
    'date.base': dateBaseMessage('transactionDate'),
    'any.required': requiredMessage('transactionDate')
  }),
  datePublished: Joi.date().messages({
    'date.base': dateBaseMessage('datePublished')
  }),
  type: Joi.string().required().valid(D365).messages({
    'string.base': stringBaseMessage('type'),
    'any.required': requiredMessage('type'),
    'any.only': typeOnlyMessage('type', D365)
  })
})
