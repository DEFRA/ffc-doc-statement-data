const db = require('../../data')

const getEtlStageLogs = async (startDate, folder) => {
  const folders = Array.isArray(folder) ? folder : [folder]

  const logsByFolder = await Promise.all(
    folders.map(async (f) => {
      const logs = await db.etlStageLog.findAll({
        where: {
          file: `${f}/export.csv`,
          ended_at: {
            [db.Sequelize.Op.gt]: startDate
          }
        }
      })

      if (logs.length > 1) {
        throw new Error(`Multiple records found for updates to ${f}, expected only one`)
      }
      return logs.length === 0 ? null : logs[0]
    })
  )

  return logsByFolder.filter(log => log !== null)
}

const executeQuery = async (query, replacements, transaction) => {
  await db.sequelize.query(query, {
    replacements,
    raw: true,
    transaction
  })
}

module.exports = {
  getEtlStageLogs,
  executeQuery
}
