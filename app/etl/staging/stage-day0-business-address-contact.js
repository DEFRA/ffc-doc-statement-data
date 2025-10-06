const { downloadAndProcessFile } = require('./stage-utils')
const { day0BusinessAddress } = require('../../constants/folders')
const { day0BusinessAddress: day0BusinessAddressTable } = require('../../constants/tables')
const { sharedColumns, getSharedMapping, sharedTransformer, sharedNonProdTransformer, sharedExcludedFields } = require('../../constants/business-address-shared/etl-data')

const columns = [...sharedColumns]

const getMapping = () => getSharedMapping()

const transformer = [...sharedTransformer]

const nonProdTransformer = [...sharedNonProdTransformer]

const excludedFields = [...sharedExcludedFields]

const stageDay0BusinessAddressContacts = async () => {
  const mapping = getMapping()
  return downloadAndProcessFile(day0BusinessAddress, day0BusinessAddressTable, columns, mapping, excludedFields, transformer, nonProdTransformer)
}

module.exports = {
  stageDay0BusinessAddressContacts
}
