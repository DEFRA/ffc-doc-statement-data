const db = require('../database')
const folders = require('../constants/folders')
const tables = require('../constants/etl-tables')
const tableMappings = require('../constants/table-mappings')
const etlIntermTables = require('../constants/etl-interm-tables')

const deleteEntryRecords = async (entry, transaction) => {
  const { file, idFrom, idTo } = entry
  const folderName = file.split('/')[0]
  const tableKey = Object.keys(folders).find(key => folders[key] === folderName)
  const tableName = tables[tableKey]
  const tableAccessorName = tableMappings[tableName]

  if (tableAccessorName && db[tableAccessorName]) {
    await db[tableAccessorName](transaction ?? undefined).whereBetween('etlId', [idFrom, idTo]).del()
    console.log(`Deleted records from ${tableAccessorName} for IDs between ${idFrom} and ${idTo}`)
  } else {
    console.warn(`No mapped table found for folder: ${folderName}, skipping...`)
  }
}

const deleteIntermRecords = async (startDate, transaction) => {
  for (const table of etlIntermTables) {
    if (db[table]) {
      await db[table](transaction ?? undefined).where('etlInsertedDt', '>=', startDate).del()
      console.log(`Deleted records from intermediate table: ${table}`)
    } else {
      console.warn(`No mapped table found for intermediate table: ${table}, skipping...`)
    }
  }
}

const deleteETLRecords = async (startDate, transaction) => {
  try {
    const stageEntries = await db.etlStageLog(transaction ?? undefined)
      .where('startedAt', '>=', startDate)
      .select('file', 'idFrom', 'idTo')

    if (!stageEntries.length) {
      console.log('No ETL records to roll back')
      return
    }

    for (const entry of stageEntries) {
      await deleteEntryRecords(entry, transaction)
    }

    await deleteIntermRecords(startDate, transaction)

    await db.etlStageLog(transaction ?? undefined).where('startedAt', '>=', startDate).del()

    console.log('Rolled back ETL records successfully')
  } catch (error) {
    console.error('Error rolling back ETL records', error)
    throw error
  }
}

module.exports = {
  deleteETLRecords
}
