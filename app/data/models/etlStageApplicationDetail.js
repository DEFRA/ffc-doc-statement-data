const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlStageApplicationDetail = sequelize.define('etlStageApplicationDetail', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    etlId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    etlInsertedDt: DataTypes.DATE,
    pkid: DataTypes.INTEGER,
    applicationId: DataTypes.INTEGER
  },
  {
    tableName: 'etlStageApplicationDetail',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageApplicationDetail
}
