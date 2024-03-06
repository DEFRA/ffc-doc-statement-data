const Joi = require('joi')
const { DAX } = require('../types')

module.exports = Joi.object({
  paymentReference: Joi.string().max(30).required(),
  calculationId: Joi.number().integer(),
  paymentPeriod: Joi.string().max(200).required(),
  totalQuarterlyPayment: Joi.number().required(),
  transDate: Joi.date().required(),
  datePublished: Joi.date(),
  type: Joi.string().required().allow(DAX)
})
