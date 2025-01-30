const db = require('../../data')

const getEtlStageLogs = async (startDate, folder) => {
  const etlStageLogs = await db.etlStageLog.findAll({
    where: {
      file: `${folder}/export.csv`,
      ended_at: {
        [db.Sequelize.Op.gt]: startDate
      }
    }
  })

  if (etlStageLogs.length > 1) {
    throw new Error(`Multiple records found for updates to ${folder}, expected only one`)
  } else if (etlStageLogs.length === 0) {
    return null
  } else {
    return etlStageLogs[0]
  }
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
