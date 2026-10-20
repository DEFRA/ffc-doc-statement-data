const { ORGANISATION, DELINKED_CALCULATION, TOTAL, DAX, D365 } = require('../constants/types')

const primaryKeyColumns = {
  [ORGANISATION]: 'sbi',
  [DELINKED_CALCULATION]: 'calculationId',
  [TOTAL]: 'calculationId',
  [DAX]: 'daxId',
  [D365]: 'd365Id'
}

const getPrimaryKeyValue = (object, type) => {
  return object[primaryKeyColumns[type]]
}

module.exports = getPrimaryKeyValue
