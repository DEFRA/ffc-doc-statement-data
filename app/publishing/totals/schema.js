const Joi = require('joi')
const { TOTALS } = require('../types')

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
  totalReference: Joi.number().integer().required(),
  sbi: Joi.number().integer().min(minSbi).max(maxSbi).required(),
  frn: Joi.number().integer().min(minFrn).max(maxFrn).required(),
  agreementNumber: Joi.number().integer().required(),
  idClaim: Joi.number().integer().required(),
  schemeType: Joi.string().max(number50).required(),
  calculationDate: Joi.date().required(),
  invoiceNumber: Joi.string().max(number20).required(),
  agreementStart: Joi.date().required(),
  agreementEnd: Joi.date().required(),
  totalAdditionalPayments: Joi.number().precision(number15).required(),
  totalActionPayments: Joi.number().precision(number15).required(),
  totalPayments: Joi.number().precision(number15).required(),
  updated: Joi.date().required(),
  datePublished: Joi.date(),
  type: Joi.string().required().allow(TOTALS),
  actions: Joi.array().items(Joi.object({
    actionReference: Joi.number().required(),
    calculationReference: Joi.number().required(),
    actionCode: Joi.string().max(number5).required(),
    actionName: Joi.string().max(number100).required(),
    fundingCode: Joi.string().max(number5).required(),
    rate: Joi.string().required().max(number100).required(),
    landArea: Joi.number().max(number18),
    uom: Joi.string().max(number10).required(),
    annualValue: Joi.string().max(number50).required(),
    quarterlyValue: Joi.string().max(number15).required(),
    overDeclarationPenalty: Joi.number().max(number15).required(),
    quarterlyPaymentAmount: Joi.string().max(number15).required(),
    groupName: Joi.string().max(number100).required(),
  })).required()
})
