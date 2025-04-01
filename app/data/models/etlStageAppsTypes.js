const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlStageAppsTypes = sequelize.define('etlStageAppsTypes', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    etlId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    etlInsertedDt: DataTypes.DATE,
    appTypeId: DataTypes.INTEGER,
    sectorPCode: DataTypes.STRING,
    sectorSCode: DataTypes.STRING,
    shortDescription: DataTypes.STRING,
    extDescription: DataTypes.STRING,
    year: DataTypes.INTEGER,
    winOpenDate: DataTypes.DATE,
    winCloseDate: DataTypes.DATE
  },
  {
    tableName: 'etlStageAppsTypes',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageAppsTypes
}
