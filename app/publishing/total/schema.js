const Joi = require('joi')
const { TOTAL } = require('../../constants/types')

const minSbi = 105000000
const maxSbi = 999999999
const minFrn = 1000000000
const maxFrn = 9999999999
const number5 = 5
const number10 = 10
const number15 = 15
const number18 = 18
const number20 = 20
const number50 = 50
const number100 = 100

module.exports = Joi.object({
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
  agreementNumber: Joi.number().integer().required().messages({
    'number.base': 'agreementNumber should be a type of number',
    'number.integer': 'agreementNumber should be an integer',
    'any.required': 'The field agreementNumber is not present but it is required'
  }),
  claimReference: Joi.number().integer().required().messages({
    'number.base': 'claimReference should be a type of number',
    'number.integer': 'claimReference should be an integer',
    'any.required': 'The field claimReference is not present but it is required'
  }),
  schemeType: Joi.string().max(number50).required().messages({
    'string.base': 'schemeType should be a type of string',
    'string.max': `schemeType should have a maximum length of ${number50}`,
    'any.required': 'The field schemeType is not present but it is required'
  }),
  calculationDate: Joi.date().required().messages({
    'date.base': 'calculationDate should be a type of date',
    'any.required': 'The field calculationDate is not present but it is required'
  }),
  invoiceNumber: Joi.string().max(number20).required().messages({
    'string.base': 'invoiceNumber should be a type of string',
    'string.max': `invoiceNumber should have a maximum length of ${number20}`,
    'any.required': 'The field invoiceNumber is not present but it is required'
  }),
  agreementStart: Joi.date().required().messages({
    'date.base': 'agreementStart should be a type of date',
    'any.required': 'The field agreementStart is not present but it is required'
  }),
  agreementEnd: Joi.date().required().messages({
    'date.base': 'agreementEnd should be a type of date',
    'any.required': 'The field agreementEnd is not present but it is required'
  }),
  totalAdditionalPayments: Joi.number().precision(number15).required().messages({
    'number.base': 'totalAdditionalPayments should be a type of number',
    'number.precision': `totalAdditionalPayments should have a precision of ${number15}`,
    'any.required': 'The field totalAdditionalPayments is not present but it is required'
  }),
  totalActionPayments: Joi.number().precision(number15).required().messages({
    'number.base': 'totalActionPayments should be a type of number',
    'number.precision': `totalActionPayments should have a precision of ${number15}`,
    'any.required': 'The field totalActionPayments is not present but it is required'
  }),
  totalPayments: Joi.number().precision(number15).required().messages({
    'number.base': 'totalPayments should be a type of number',
    'number.precision': `totalPayments should have a precision of ${number15}`,
    'any.required': 'The field totalPayments is not present but it is required'
  }),
  updated: Joi.date().required().messages({
    'date.base': 'updated should be a type of date',
    'any.required': 'The field updated is not present but it is required'
  }),
  datePublished: Joi.date().messages({
    'date.base': 'datePublished should be a type of date'
  }),
  type: Joi.string().required().allow(TOTAL).messages({
    'string.base': 'type should be a type of string',
    'any.required': 'The field type is not present but it is required',
    'any.only': `type must be : ${TOTAL}`
  }),
  actions: Joi.array().items(Joi.object({
    actionReference: Joi.number().required().messages({
      'number.base': 'actionReference should be a type of number',
      'any.required': 'The field actionReference is not present but it is required'
    }),
    calculationReference: Joi.number().required().messages({
      'number.base': 'calculationReference should be a type of number',
      'any.required': 'The field calculationReference is not present but it is required'
    }),
    actionCode: Joi.string().max(number5).required().messages({
      'string.base': 'actionCode should be a type of string',
      'string.max': `actionCode should have a maximum length of ${number5}`,
      'any.required': 'The field actionCode is not present but it is required'
    }),
    actionName: Joi.string().max(number100).required().messages({
      'string.base': 'actionName should be a type of string',
      'string.max': `actionName should have a maximum length of ${number100}`,
      'any.required': 'The field actionName is not present but it is required'
    }),
    fundingCode: Joi.string().max(number5).required().messages({
      'string.base': 'fundingCode should be a type of string',
      'string.max': `fundingCode should have a maximum length of ${number5}`,
      'any.required': 'The field fundingCode is not present but it is required'
    }),
    rate: Joi.string().required().max(number100).required().messages({
      'string.base': 'rate should be a type of string',
      'string.max': `rate should have a maximum length of ${number100}`,
      'any.required': 'The field rate is not present but it is required'
    }),
    landArea: Joi.string().max(number18).messages({
      'string.base': 'landArea should be a type of string',
      'string.max': `landArea should have a maximum length of ${number18}`
    }),
    uom: Joi.string().max(number10).messages({
      'string.base': 'uom should be a type of string',
      'string.max': `uom should have a maximum length of ${number10}`
    }),
    annualValue: Joi.string().max(number50).required().messages({
      'string.base': 'annualValue should be a type of string',
      'string.max': `annualValue should have a maximum length of ${number50}`,
      'any.required': 'The field annualValue is not present but it is required'
    }),
    quarterlyValue: Joi.string().max(number15).required().messages({
      'string.base': 'quarterlyValue should be a type of string',
      'string.max': `quarterlyValue should have a maximum length of ${number15}`,
      'any.required': 'The field quarterlyValue is not present but it is required'
    }),
    overDeclarationPenalty: Joi.number().precision(number15).required().messages({
      'number.base': 'overDeclarationPenalty should be a type of number',
      'number.precision': `overDeclarationPenalty should have a precision of ${number15}`,
      'any.required': 'The field overDeclarationPenalty is not present but it is required'
    }),
    quarterlyPaymentAmount: Joi.string().max(number15).required().messages({
      'string.base': 'quarterlyPaymentAmount should be a type of string',
      'string.max': `quarterlyPaymentAmount should have a maximum length of ${number15}`,
      'any.required': 'The field quarterlyPaymentAmount is not present but it is required'
    }),
    groupName: Joi.string().max(number100).required().messages({
      'string.base': 'groupName should be a type of string',
      'string.max': `groupName should have a maximum length of ${number100}`,
      'any.required': 'The field groupName is not present but it is required'
    })
  })).required().messages({
    'any.required': 'The actions data is not present but it is required'
  })
})
