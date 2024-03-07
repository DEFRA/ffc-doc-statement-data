const Joi = require('joi')
const { CALCULATION } = require('../types')
const minSbi = 105000000
const minFrn = 1000000000
const maxSbiFrn = 999999999

module.exports = Joi.object({
  calculationReference: Joi.number().required(),
  sbi: Joi.number().integer().min(minSbi).max(maxSbiFrn).required(),
  frn: Joi.number().integer().min(minFrn).max(maxSbiFrn).required(),
  calculationDate: Joi.date().required(),
  invoiceNumber: Joi.string().required(),
  scheme: Joi.string().required(),
  fundings: Joi.array().items(Joi.object({
    fundingCode: Joi.string().required(),
    areaClaimed: Joi.number().required(),
    rate: Joi.number().required()
  })).required(),
  updated: Joi.date().required(),
  type: Joi.string().required().allow(CALCULATION)
})
