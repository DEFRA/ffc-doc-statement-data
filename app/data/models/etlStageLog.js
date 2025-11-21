const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const comment = 'Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'
const commentDate = 'Example Output: 2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'

module.exports = (sequelize, DataTypes) => {
  const etlStageLog = sequelize.define('etlStageLog', {
    etlId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, comment },
    etlInsertedDt: { type: DataTypes.DATE, comment: commentDate },
    file: { type: DataTypes.STRING, comment },
    startedAt: { type: DataTypes.DATE, comment: commentDate },
    endedAt: { type: DataTypes.DATE, comment: commentDate },
    rowCount: { type: DataTypes.INTEGER, comment },
    rowsLoadedCount: { type: DataTypes.INTEGER, comment },
    idFrom: { type: DataTypes.INTEGER, comment },
    idTo: { type: DataTypes.INTEGER, comment }
  },
  {
    tableName: 'etlStageLog',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageLog
}
