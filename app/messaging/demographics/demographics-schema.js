const Joi = require('joi')
const baseOrganisationSchema = require('../../constants/base-organisation-schema')

module.exports = Joi.object(baseOrganisationSchema)
