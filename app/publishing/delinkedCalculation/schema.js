const Joi = require('joi')
const { DELINKEDCALCULATION } = require('../types')

const minSbi = 105000000
const maxSbi = 999999999
const minFrn = 1000000000
const maxFrn = 9999999999
const number15 = 15

module.exports = Joi.object({
  applicationId: Joi.number().integer().required().messages({
    'number.base': 'applicationId should be a type of number',
    'number.integer': 'applicationId should be an integer',
    'any.required': 'The field applicationId is not present but it is required'
  }),
  calculationReference: Joi.number().integer().required().messages({
    'number.base': 'calculationReference should be a type of number',
    'number.integer': 'calculationReference should be an integer',
    'any.required': 'The field calculationReference is not present but it is required'
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
  paymentBand1: Joi.number().integer().required().messages({
    'number.base': 'paymentBand1 should be a type of number',
    'number.integer': 'paymentBand1 should be an integer',
    'any.required': 'The field paymentBand1 is not present but it is required'
  }),
  paymentBand2: Joi.number().integer().required().messages({
    'number.base': 'paymentBand2 should be a type of number',
    'number.integer': 'paymentBand2 should be an integer',
    'any.required': 'The field paymentBand2 is not present but it is required'
  }),
  paymentBand3: Joi.number().integer().required().messages({
    'number.base': 'paymentBand3 should be a type of number',
    'number.integer': 'paymentBand3 should be an integer',
    'any.required': 'The field paymentBand3 is not present but it is required'
  }),
  paymentBand4: Joi.number().integer().required().messages({
    'number.base': 'paymentBand4 should be a type of number',
    'number.integer': 'paymentBand4 should be an integer',
    'any.required': 'The field paymentBand4 is not present but it is required'
  }),
  percentageReduction1: Joi.number().integer().required().messages({
    'number.base': 'percentageReduction1 should be a type of number',
    'number.integer': 'percentageReduction1 should be an integer',
    'any.required': 'The field percentageReduction1 is not present but it is required'
  }),
  percentageReduction2: Joi.number().integer().required().messages({
    'number.base': 'percentageReduction2 should be a type of number',
    'number.integer': 'percentageReduction2 should be an integer',
    'any.required': 'The field percentageReduction2 is not present but it is required'
  }),
  percentageReduction3: Joi.number().integer().required().messages({
    'number.base': 'percentageReduction3 should be a type of number',
    'number.integer': 'percentageReduction3 should be an integer',
    'any.required': 'The field percentageReduction3 is not present but it is required'
  }),
  percentageReduction4: Joi.number().integer().required().messages({
    'number.base': 'percentageReduction4 should be a type of number',
    'number.integer': 'percentageReduction4 should be an integer',
    'any.required': 'The field percentageReduction4 is not present but it is required'
  }),
  progressiveReductions1: Joi.number().precision(number15).required().messages({
    'number.base': 'progressiveReductions1 should be a type of number',
    'number.precision': `progressiveReductions1 should have a precision of ${number15}`,
    'any.required': 'The field progressiveReductions1 is not present but it is required'
  }),
  progressiveReductions2: Joi.number().precision(number15).required().messages({
    'number.base': 'progressiveReductions2 should be a type of number',
    'number.precision': `progressiveReductions2 should have a precision of ${number15}`,
    'any.required': 'The field progressiveReductions2 is not present but it is required'
  }),
  progressiveReductions3: Joi.number().precision(number15).required().messages({
    'number.base': 'progressiveReductions3 should be a type of number',
    'number.precision': `progressiveReductions3 should have a precision of ${number15}`,
    'any.required': 'The field progressiveReductions3 is not present but it is required'
  }),
  progressiveReductions4: Joi.number().precision(number15).required().messages({
    'number.base': 'progressiveReductions4 should be a type of number',
    'number.precision': `progressiveReductions4 should have a precision of ${number15}`,
    'any.required': 'The field progressiveReductions4 is not present but it is required'
  }),
  referenceAmount: Joi.number().precision(number15).required().messages({
    'number.base': 'referenceAmount should be a type of number',
    'number.precision': `referenceAmount should have a precision of ${number15}`,
    'any.required': 'The field referenceAmount is not present but it is required'
  }),
  totalProgressiveReduction: Joi.number().precision(number15).required().messages({
    'number.base': 'totalProgressiveReduction should be a type of number',
    'number.precision': `totalProgressiveReduction should have a precision of ${number15}`,
    'any.required': 'The field totalProgressiveReduction is not present but it is required'
  }),
  totalDelinkedPayment: Joi.number().precision(number15).required().messages({
    'number.base': 'totalDelinkedPayment should be a type of number',
    'number.precision': `totalDelinkedPayment should have a precision of ${number15}`,
    'any.required': 'The field totalDelinkedPayment is not present but it is required'
  }),
  paymentAmountCalculated: Joi.number().precision(number15).required().messages({
    'number.base': 'paymentAmountCalculated should be a type of number',
    'number.precision': `paymentAmountCalculated should have a precision of ${number15}`,
    'any.required': 'The field paymentAmountCalculated is not present but it is required'
  }),
  type: Joi.string().required().allow(DELINKEDCALCULATION).messages({
    'string.base': 'type should be a type of string',
    'any.required': 'The field type is not present but it is required',
    'any.only': `type must be : ${DELINKEDCALCULATION}`
  })
})
