const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlStageLog = sequelize.define('etlStageLog', {
    etlId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    etlInsertedDt: DataTypes.DATE,
    file: DataTypes.STRING,
    startedAt: DataTypes.DATE,
    endedAt: DataTypes.DATE,
    rowCount: DataTypes.INTEGER,
    rowsLoadedCount: DataTypes.INTEGER,
    idFrom: DataTypes.INTEGER,
    idTo: DataTypes.INTEGER
  },
  {
    tableName: 'etlStageLog',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageLog
}
