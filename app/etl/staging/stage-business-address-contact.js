const sourceColumnNames = require('../../constants/source-column-names')
const targetColumnNames = require('../../constants/target-column-names')
const { businessAddressDelinked } = require('../../constants/tables')
const { downloadAndProcessFile, monthDayYearDateTimeFormat } = require('./stage-utils')
const { VARCHAR, DATE } = require('../../constants/target-column-types')
const { sharedColumns, getSharedMapping, sharedTransformer, sharedNonProdTransformer, sharedExcludedFields } = require('../../constants/business-address-shared/etl-data')

const columns = [
  sourceColumnNames.CHANGE_TYPE,
  sourceColumnNames.CHANGE_TIME,
  ...sharedColumns
]

const getMapping = (format) => {
  return [
    { column: sourceColumnNames.CHANGE_TYPE, targetColumn: targetColumnNames.changeType, targetType: VARCHAR },
    { column: sourceColumnNames.CHANGE_TIME, targetColumn: targetColumnNames.changeTime, targetType: DATE, format },
    ...getSharedMapping()
  ]
}

const transformer = [...sharedTransformer]

const nonProdTransformer = [...sharedNonProdTransformer]

const excludedFields = [...sharedExcludedFields]

const stageBusinessAddressContacts = async () => {
  const mapping = getMapping(monthDayYearDateTimeFormat)
  return downloadAndProcessFile('businessAddressDelinked', businessAddressDelinked, columns, mapping, excludedFields, transformer, nonProdTransformer)
}

module.exports = {
  stageBusinessAddressContacts
}
