const { defraLinks } = require('../../constants/tables')
const { downloadAndProcessFile, dateTimeFormat } = require('./stage-utils')

const stageDefraLinks = async () => {
  const columns = [
    'CHANGE_TYPE', 'CHANGE_TIME', 'SUBJECT_ID', 'DEFRA_ID', 'DEFRA_TYPE', 'MDM_ID'
  ]

  const mapping = [
    { column: 'CHANGE_TYPE', targetColumn: 'change_type', targetType: 'varchar' },
    { column: 'CHANGE_TIME', targetColumn: 'change_time', targetType: 'date', format: dateTimeFormat },
    { column: 'SUBJECT_ID', targetColumn: 'subject_id', targetType: 'number' },
    { column: 'DEFRA_ID', targetColumn: 'defra_id', targetType: 'varchar' },
    { column: 'DEFRA_TYPE', targetColumn: 'defra_type', targetType: 'varchar' },
    { column: 'MDM_ID', targetColumn: 'mdm_id', targetType: 'number' }
  ]

  return downloadAndProcessFile('defraLinks', 'defraLinks', defraLinks, columns, mapping)
}

module.exports = {
  stageDefraLinks
}
