const db = require('../data')
const folders = require('../constants/folders')
const tables = require('../constants/tables')
const tableMappings = require('../constants/table-mappings')

const deleteETLRecords = async (startDate, transaction) => {
  try {
    const stageEntries = await db.etlStageLog.findAll({
      attributes: [
        'file',
        ['id_from', 'idFrom'],
        ['id_to', 'idTo']
      ],
      where: {
        started_at: {
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
          where: { etl_id: { [db.Sequelize.Op.between]: [idFrom, idTo] } },
          transaction
        })
        console.log(`Deleted records from ${sequelizeTableName} for IDs between ${idFrom} and ${idTo}`)
      } else {
        console.warn(`No mapped table found for folder: ${folderName}, skipping...`)
      }
    }

    await db.etlStageLog.destroy({
      where: {
        started_at: { [db.Sequelize.Op.gte]: startDate }
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
