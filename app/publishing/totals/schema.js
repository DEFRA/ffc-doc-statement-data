const Joi = require('joi')
const { TOTALS } = require('../types')
const minSbi = 105000000
const maxSbi = 999999999
const minFrn = 1000000000
const maxFrn = 9999999999
const number15 = 15
const number20 = 20
const number50 = 50

module.exports = Joi.object({
  calculationId: Joi.number().integer().required(),
  sbi: Joi.number().integer().min(minSbi).max(maxSbi).required(),
  frn: Joi.number().integer().min(minFrn).max(maxFrn).required(),
  agreementNumber: Joi.number().integer().required(),
  claimId: Joi.number().integer().required(),
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
  type: Joi.string().required().allow(TOTALS)
})
