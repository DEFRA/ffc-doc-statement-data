const Joi = require('joi')
const { DELINKED_CALCULATION } = require('../../constants/types')

const minSbi = 105000000
const maxSbi = 999999999
const minFrn = 1000000000
const maxFrn = 9999999999
const maxStringLength = 4000

const stringRequired = Joi.string().required()
const numberRequired = Joi.number().integer().required()

const messages = {
  number: {
    base: 'should be a type of number',
    integer: 'should be an integer',
    required: 'is not present but it is required'
  },
  string: {
    base: 'should be a type of string',
    required: 'is not present but it is required',
    patternPercentage: 'must match the pattern: 1 to 3 digits, a full stop, and 2 digits (e.g. 99.99)',
    patternMonetary: 'must match the pattern: 1 or more digits, a full stop, and 2 digits (e.g. 1000.00)'
  },
  date: {
    base: 'should be a type of date'
  }
}

const percentageReductionPattern = /^\d{1,3}\.\d{2}$/
const monetaryPattern = /^\d+\.\d{2}$/

module.exports = Joi.object({
  calculationReference: numberRequired.messages({
    'number.base': `calculationId ${messages.number.base}`,
    'number.integer': `calculationId ${messages.number.integer}`,
    'any.required': `The field calculationId ${messages.number.required}`
  }),
  applicationReference: numberRequired.messages({
    'number.base': `applicationId ${messages.number.base}`,
    'number.integer': `applicationId ${messages.number.integer}`,
    'any.required': `The field applicationId ${messages.number.required}`
  }),
  sbi: numberRequired.min(minSbi).max(maxSbi).messages({
    'number.base': `sbi ${messages.number.base}`,
    'number.integer': `sbi ${messages.number.integer}`,
    'number.min': `sbi should have a minimum value of ${minSbi}`,
    'number.max': `sbi should have a maximum value of ${maxSbi}`,
    'any.required': `The field sbi ${messages.number.required}`
  }),
  frn: numberRequired.min(minFrn).max(maxFrn).messages({
    'number.base': `frn ${messages.number.base}`,
    'number.integer': `frn ${messages.number.integer}`,
    'number.min': `frn should have a minimum value of ${minFrn}`,
    'number.max': `frn should have a maximum value of ${maxFrn}`,
    'any.required': `The field frn ${messages.number.required}`
  }),
  paymentBand1: stringRequired.max(maxStringLength).messages({
    'string.base': `paymentBand1 ${messages.string.base}`,
    'string.max': `paymentBand1 should have a maximum length of ${maxStringLength}`,
    'any.required': `The field paymentBand1 ${messages.string.required}`
  }),
  paymentBand2: stringRequired.max(maxStringLength).messages({
    'string.base': `paymentBand2 ${messages.string.base}`,
    'string.max': `paymentBand2 should have a maximum length of ${maxStringLength}`,
    'any.required': `The field paymentBand2 ${messages.string.required}`
  }),
  paymentBand3: stringRequired.max(maxStringLength).messages({
    'string.base': `paymentBand3 ${messages.string.base}`,
    'string.max': `paymentBand3 should have a maximum length of ${maxStringLength}`,
    'any.required': `The field paymentBand3 ${messages.string.required}`
  }),
  paymentBand4: stringRequired.max(maxStringLength).messages({
    'string.base': `paymentBand4 ${messages.string.base}`,
    'string.max': `paymentBand4 should have a maximum length of ${maxStringLength}`,
    'any.required': `The field paymentBand4 ${messages.string.required}`
  }),
  percentageReduction1: stringRequired.pattern(percentageReductionPattern).messages({
    'string.base': `percentageReduction1 ${messages.string.base}`,
    'string.pattern.base': `percentageReduction1 ${messages.string.patternPercentage}`,
    'any.required': `The field percentageReduction1 ${messages.string.required}`
  }),
  percentageReduction2: stringRequired.pattern(percentageReductionPattern).messages({
    'string.base': `percentageReduction2 ${messages.string.base}`,
    'string.pattern.base': `percentageReduction2 ${messages.string.patternPercentage}`,
    'any.required': `The field percentageReduction2 ${messages.string.required}`
  }),
  percentageReduction3: stringRequired.pattern(percentageReductionPattern).messages({
    'string.base': `percentageReduction3 ${messages.string.base}`,
    'string.pattern.base': `percentageReduction3 ${messages.string.patternPercentage}`,
    'any.required': `The field percentageReduction3 ${messages.string.required}`
  }),
  percentageReduction4: stringRequired.pattern(percentageReductionPattern).messages({
    'string.base': `percentageReduction4 ${messages.string.base}`,
    'string.pattern.base': `percentageReduction4 ${messages.string.patternPercentage}`,
    'any.required': `The field percentageReduction4 ${messages.string.required}`
  }),
  progressiveReductions1: stringRequired.pattern(monetaryPattern).messages({
    'string.base': `progressiveReductions1 ${messages.string.base}`,
    'string.pattern.base': `progressiveReductions1 ${messages.string.patternMonetary}`,
    'any.required': `The field progressiveReductions1 ${messages.string.required}`
  }),
  progressiveReductions2: stringRequired.pattern(monetaryPattern).messages({
    'string.base': `progressiveReductions2 ${messages.string.base}`,
    'string.pattern.base': `progressiveReductions2 ${messages.string.patternMonetary}`,
    'any.required': `The field progressiveReductions2 ${messages.string.required}`
  }),
  progressiveReductions3: stringRequired.pattern(monetaryPattern).messages({
    'string.base': `progressiveReductions3 ${messages.string.base}`,
    'string.pattern.base': `progressiveReductions3 ${messages.string.patternMonetary}`,
    'any.required': `The field progressiveReductions3 ${messages.string.required}`
  }),
  progressiveReductions4: stringRequired.pattern(monetaryPattern).messages({
    'string.base': `progressiveReductions4 ${messages.string.base}`,
    'string.pattern.base': `progressiveReductions4 ${messages.string.patternMonetary}`,
    'any.required': `The field progressiveReductions4 ${messages.string.required}`
  }),
  referenceAmount: stringRequired.pattern(monetaryPattern).messages({
    'string.base': `referenceAmount ${messages.string.base}`,
    'string.pattern.base': `referenceAmount ${messages.string.patternMonetary}`,
    'any.required': `The field referenceAmount ${messages.string.required}`
  }),
  totalProgressiveReduction: stringRequired.pattern(monetaryPattern).messages({
    'string.base': `totalProgressiveReduction ${messages.string.base}`,
    'string.pattern.base': `totalProgressiveReduction ${messages.string.patternMonetary}`,
    'any.required': `The field totalProgressiveReduction ${messages.string.required}`
  }),
  totalDelinkedPayment: stringRequired.pattern(monetaryPattern).messages({
    'string.base': `totalDelinkedPayment ${messages.string.base}`,
    'string.pattern.base': `totalDelinkedPayment ${messages.string.patternMonetary}`,
    'any.required': `The field totalDelinkedPayment ${messages.string.required}`
  }),
  paymentAmountCalculated: stringRequired.pattern(monetaryPattern).messages({
    'string.base': `paymentAmountCalculated ${messages.string.base}`,
    'string.pattern.base': `paymentAmountCalculated ${messages.string.patternMonetary}`,
    'any.required': `The field paymentAmountCalculated ${messages.string.required}`
  }),
  updated: Joi.date().required().messages({
    'date.base': `updated ${messages.date.base}`,
    'any.required': `The field updated ${messages.string.required}`
  }),
  datePublished: Joi.date().messages({
    'date.base': `datePublished ${messages.date.base}`,
    'any.required': `The field datePublished ${messages.string.required}`
  }),
  type: stringRequired.valid(DELINKED_CALCULATION).messages({
    'string.base': `type ${messages.string.base}`,
    'any.required': `The field type ${messages.string.required}`,
    'any.only': `type must be : ${DELINKED_CALCULATION}`
  })
})
