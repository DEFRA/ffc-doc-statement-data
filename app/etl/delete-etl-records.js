const db = require('../data')
const folders = require('../constants/folders')
const tables = require('../constants/tables')
const tableMappings = require('../constants/table-mappings')
const etlIntermTables = require('../constants/etl-interm-tables')

const deleteETLRecords = async (startDate, transaction) => {
  try {
    const stageEntries = await db.etlStageLog.findAll({
      attributes: [
        'file',
        'idFrom',
        'idTo'
      ],
      where: {
        startedAt: {
          [db.Sequelize.Op.gte]: startDate
        }
      },
      transaction
    })

    if (!stageEntries.length) {
      console.log('No ETL records to roll back')
      return
    }

    for (const entry of stageEntries) {
      const { file, idFrom, idTo } = entry.dataValues
      const folderName = file.split('/')[0]
      const tableKey = Object.keys(folders).find(key => folders[key] === folderName)
      const tableName = tables[tableKey]
      const sequelizeTableName = tableMappings[tableName]

      if (sequelizeTableName && db[sequelizeTableName]) {
        await db[sequelizeTableName].destroy({
          where: { etlId: { [db.Sequelize.Op.between]: [idFrom, idTo] } },
          transaction
        })
        console.log(`Deleted records from ${sequelizeTableName} for IDs between ${idFrom} and ${idTo}`)
      } else {
        console.warn(`No mapped table found for folder: ${folderName}, skipping...`)
      }
    }

    for (const table of etlIntermTables) {
      if (db[table]) {
        await db[table].destroy({
          where: { etlInsertedDt: { [db.Sequelize.Op.gte]: startDate } },
          transaction
        })
        console.log(`Deleted records from intermediate table: ${table}`)
      } else {
        console.warn(`No mapped table found for intermediate table: ${table}, skipping...`)
      }
    }

    await db.etlStageLog.destroy({
      where: {
        startedAt: { [db.Sequelize.Op.gte]: startDate }
      },
      transaction
    })

    console.log('Rolled back ETL records successfully')
  } catch (error) {
    console.error('Error rolling back ETL records', error)
    throw error
  }
}

module.exports = {
  deleteETLRecords
}
