const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlStageCssOptions = sequelize.define('etlStageCssOptions', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    etlId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    etlInsertedDt: DataTypes.DATE,
    cssOptionId: DataTypes.INTEGER,
    startDt: DataTypes.DATE,
    endDt: DataTypes.DATE
  },
  {
    tableName: 'etlStageCssOptions',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageCssOptions
}
