const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlStageCssOptions = sequelize.define('etlStageCssOptions', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    etlId: DataTypes.INTEGER,
    etlInsertedDt: DataTypes.DATE,
    cssOptionId: DataTypes.INTEGER,
    optionTypeId: DataTypes.INTEGER,
    optionDescription: DataTypes.STRING,
    optionLongDescription: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    optionCode: DataTypes.STRING,
    contractTypeId: DataTypes.INTEGER,
    startDt: DataTypes.DATE,
    endDt: DataTypes.DATE,
    groupId: DataTypes.STRING
  },
  {
    tableName: 'etlStageCssOptions',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageCssOptions
}
