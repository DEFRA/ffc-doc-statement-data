const Joi = require('joi')
const { DELINKED } = require('../types')

const minSbi = 105000000
const maxSbi = 999999999
const minFrn = 1000000000
const maxFrn = 9999999999

module.exports = Joi.object({
  calculationReference: Joi.number().integer().required().messages({
    'number.base': 'calculationId should be a type of number',
    'number.integer': 'calculationId should be an integer',
    'any.required': 'The field calculationId is not present but it is required'
  }),
  sbi: Joi.number().integer().min(minSbi).max(maxSbi).required().messages({
    'number.base': 'sbi should be a type of number',
    'number.integer': 'sbi should be an integer',
    'number.min': `sbi should have a minimum value of ${minSbi}`,
    'number.max': `sbi should have a maximum value of ${maxSbi}`,
    'any.required': 'The field sbi is not present but it is required'
  }),
  frn: Joi.number().integer().min(minFrn).max(maxFrn).required().messages({
    'number.base': 'frn should be a type of number',
    'number.integer': 'frn should be an integer',
    'number.min': `frn should have a minimum value of ${minFrn}`,
    'number.max': `frn should have a maximum value of ${maxFrn}`,
    'any.required': 'The field frn is not present but it is required'
  }),
  paymentBand1: Joi.string().required().messages({
    'string.base': 'paymentBand1 should be a type of string',
    'any.required': 'The field paymentBand1 is not present but it is required'
  }),
  paymentBand2: Joi.string().required().messages({
    'string.base': 'paymentBand2 should be a type of string',
    'any.required': 'The field paymentBand2 is not present but it is required'
  }),
  paymentBand3: Joi.string().required().messages({
    'string.base': 'paymentBand3 should be a type of string',
    'any.required': 'The field paymentBand3 is not present but it is required'
  }),
  paymentBand4: Joi.string().required().messages({
    'string.base': 'paymentBand4 should be a type of string',
    'any.required': 'The field paymentBand4 is not present but it is required'
  }),
  percentageReduction1: Joi.string().required().messages({
    'string.base': 'percentageReduction1 should be a type of string',
    'any.required': 'The field percentageReduction1 is not present but it is required'
  }),
  percentageReduction2: Joi.string().required().messages({
    'string.base': 'percentageReduction2 should be a type of string',
    'any.required': 'The field percentageReduction2 is not present but it is required'
  }),
  percentageReduction3: Joi.string().required().messages({
    'string.base': 'percentageReduction3 should be a type of string',
    'any.required': 'The field percentageReduction3 is not present but it is required'
  }),
  percentageReduction4: Joi.string().required().messages({
    'string.base': 'percentageReduction4 should be a type of string',
    'any.required': 'The field percentageReduction4 is not present but it is required'
  }),
  progressiveReductions1: Joi.string().required().messages({
    'string.base': 'progressiveReductions1 should be a type of string',
    'any.required': 'The field progressiveReductions1 is not present but it is required'
  }),
  progressiveReductions2: Joi.string().required().messages({
    'string.base': 'progressiveReductions2 should be a type of string',
    'any.required': 'The field progressiveReductions2 is not present but it is required'
  }),
  progressiveReductions3: Joi.string().required().messages({
    'string.base': 'progressiveReductions3 should be a type of string',
    'any.required': 'The field progressiveReductions3 is not present but it is required'
  }),
  progressiveReductions4: Joi.string().required().messages({
    'string.base': 'progressiveReductions4 should be a type of string',
    'any.required': 'The field progressiveReductions4 is not present but it is required'
  }),
  referenceAmount: Joi.string().required().messages({
    'string.base': 'referenceAmount should be a type of string',
    'any.required': 'The field referenceAmount is not present but it is required'
  }),
  totalProgressiveReduction: Joi.string().required().messages({
    'string.base': 'totalProgressiveReduction should be a type of string',
    'any.required': 'The field totalProgressiveReduction is not present but it is required'
  }),
  totalDelinkedPayment: Joi.string().required().messages({
    'string.base': 'totalDelinkedPayment should be a type of string',
    'any.required': 'The field totalDelinkedPayment is not present but it is required'
  }),
  paymentAmountCalculated: Joi.string().required().messages({
    'string.base': 'paymentAmountCalculated should be a type of string',
    'any.required': 'The field paymentAmountCalculated is not present but it is required'
  }),
  updated: Joi.date().messages({
    'date.base': 'updated should be a type of date',
    'any.required': 'The field updated is not present but it is required'
  }),
  datePublished: Joi.date().messages({
    'date.base': 'datePublished should be a type of date'
  }),
  type: Joi.string().required().valid(DELINKED).messages({
    'string.base': 'type should be a type of string',
    'any.required': 'The field type is not present but it is required',
    'any.only': `type must be : ${DELINKED}`
  })
})
