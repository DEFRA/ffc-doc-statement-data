const Joi = require('joi')
const { TOTALS } = require('../types')

module.exports = Joi.object({
  calculationId: Joi.number().integer().required(),
  sbi: Joi.number().integer().min(105000000).max(999999999).required(),
  frn: Joi.number().integer().min(1000000000).max(9999999999).required(),
  agreementNumber: Joi.number().integer().required(),
  claimId: Joi.number().integer().required(),
  schemeType: Joi.string().max(50).required(),
  calculationDate: Joi.date().required(),
  invoiceNumber: Joi.string().max(20).required(),
  agreementStart: Joi.date().required(),
  agreementEnd: Joi.date().required(),
  totalAdditionalPayments: Joi.number().precision(15).required(),
  totalActionPayments: Joi.number().precision(15).required(),
  updated: Joi.date().required(),
  datePublished: Joi.date(),
  type: Joi.string().required().allow(TOTALS)
})
