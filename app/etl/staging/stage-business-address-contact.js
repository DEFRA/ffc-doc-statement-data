const sourceColumnNames = require('../../constants/source-column-names')
const targetColumnNames = require('../../constants/target-column-names')
const { businessAddress } = require('../../constants/tables')
const { downloadAndProcessFile, dateTimeFormat, monthDayYearDateTimeFormat } = require('./stage-utils')
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

const stageBusinessAddressContacts = async (monthDayFormat = false, folder = 'businessAddress') => {
  const format = monthDayFormat ? monthDayYearDateTimeFormat : dateTimeFormat
  const mapping = getMapping(format)
  return downloadAndProcessFile(folder, businessAddress, columns, mapping, excludedFields, transformer, nonProdTransformer)
}

const stageBusinessAddressContactsDelinked = async () => {
  return stageBusinessAddressContacts(true, 'businessAddressDelinked')
}

module.exports = {
  stageBusinessAddressContacts,
  stageBusinessAddressContactsDelinked
}
