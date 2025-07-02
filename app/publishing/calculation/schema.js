const Joi = require('joi')
const { CALCULATION } = require('../../constants/types')
const MIN_SBI = 105000000
const MAX_SBI = 999999999
const MIN_FRN = 1000000000
const MAX_FRN = 9999999999

module.exports = Joi.object({
  calculationReference: Joi.number().required().messages({
    'number.base': 'calculationReference should be a type of number',
    'any.required': 'The field calculationReference is not present but it is required'
  }),
  sbi: Joi.number().integer().min(MIN_SBI).max(MAX_SBI).required().messages({
    'number.base': 'sbi should be a type of number',
    'number.integer': 'sbi should be an integer',
    'number.min': 'sbi should have a minimum value of 105000000',
    'number.max': 'sbi should have a maximum value of 999999999',
    'any.required': 'The field sbi is not present but it is required'
  }),
  frn: Joi.number().integer().min(MIN_FRN).max(MAX_FRN).required().messages({
    'number.base': 'frn should be a type of number',
    'number.integer': 'frn should be an integer',
    'number.min': 'frn should have a minimum value of 1000000000',
    'number.max': 'frn should have a maximum value of 9999999999',
    'any.required': 'The field frn is not present but it is required'
  }),
  calculationDate: Joi.date().required().messages({
    'date.base': 'calculationDate should be a type of date',
    'any.required': 'The field calculationDate is not present but it is required'
  }),
  invoiceNumber: Joi.string().required().messages({
    'string.base': 'invoiceNumber should be a type of string',
    'any.required': 'The field invoiceNumber is not present but it is required'
  }),
  scheme: Joi.string().required().messages({
    'string.base': 'scheme should be a type of string',
    'any.required': 'The field scheme is not present but it is required'
  }),
  fundings: Joi.array().items(Joi.object({
    fundingCode: Joi.string().required().messages({
      'string.base': 'fundingCode should be a type of string',
      'any.required': 'The field fundingCode is not present but it is required'
    }),
    areaClaimed: Joi.number().required().messages({
      'number.base': 'areaClaimed should be a type of number',
      'any.required': 'The field areaClaimed is not present but it is required'
    }),
    rate: Joi.number().required().messages({
      'number.base': 'rate should be a type of number',
      'any.required': 'The field rate is not present but it is required'
    })
  })).required().messages({
    'array.base': 'fundings should be an array',
    'any.required': 'The field fundings is not present but it is required'
  }),
  updated: Joi.date().required().messages({
    'date.base': 'updated should be a type of date',
    'any.required': 'The field updated is not present but it is required'
  }),
  type: Joi.string().required().allow(CALCULATION).messages({
    'string.base': 'type should be a type of string',
    'any.required': 'The field type is not present but it is required',
    'any.only': `type must be : ${CALCULATION}`
  })
})
