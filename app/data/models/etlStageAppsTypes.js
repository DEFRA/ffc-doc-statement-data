const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlStageAppsTypes = sequelize.define('etlStageAppsTypes', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    etlId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    etlInsertedDt: DataTypes.DATE
  },
  {
    tableName: 'etlStageAppsTypes',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageAppsTypes
}
