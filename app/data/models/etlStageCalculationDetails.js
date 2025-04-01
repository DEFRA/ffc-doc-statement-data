const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlStageCalculationDetails = sequelize.define('etlStageCalculationDetails', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    etlId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    etlInsertedDt: DataTypes.DATE,
    applicationId: DataTypes.INTEGER,
    idClcHeader: DataTypes.INTEGER,
    calculationId: DataTypes.INTEGER,
    calculationDt: DataTypes.DATE,
    ranked: DataTypes.INTEGER
  },
  {
    tableName: 'etlStageCalculationDetails',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageCalculationDetails
}
