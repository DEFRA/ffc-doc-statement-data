const Joi = require('joi')
const { DAX } = require('../types')
const number30 = 30
const number200 = 200

module.exports = Joi.object({
  paymentReference: Joi.string().max(number30).required(),
  calculationReference: Joi.number().integer(),
  paymentPeriod: Joi.string().max(number200).allow('', null).optional(),
  paymentAmount: Joi.number().required(),
  transactionDate: Joi.date().required(),
  datePublished: Joi.date(),
  type: Joi.string().required().allow(DAX)
})
