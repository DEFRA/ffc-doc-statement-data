const Joi = require('joi')
const { ORGANISATION } = require('../../constants/types')
const baseOrganisationSchema = require('../../constants/base-organisation-schema')

module.exports = Joi.object({
  ...baseOrganisationSchema,
  type: Joi.string().required().valid(ORGANISATION).messages({
    'string.base': 'type should be a type of string',
    'any.required': 'The field type is not present but it is required',
    'any.only': `type must be : ${ORGANISATION}`
  })
})
