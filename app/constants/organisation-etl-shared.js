const sourceColumnNames = require('./source-column-names')
const config = require('../config')
const { COMPANY_NAME } = require('./fakers')

const sharedTransformer = [
  {
    column: sourceColumnNames.ORGANISATION_NAME,
    find: '\'',
    replace: '\'\'',
    all: true
  }
]

let sharedNonProdTransformer = []
if (config.etlConfig.fakeData) {
  sharedNonProdTransformer = [
    {
      name: sourceColumnNames.ORGANISATION_NAME,
      faker: COMPANY_NAME
    }
  ]
}

module.exports = {
  sharedTransformer,
  sharedNonProdTransformer
}
