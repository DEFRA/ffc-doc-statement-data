const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlStageCssContracts = sequelize.define('etlStageCssContracts', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    etlId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    etlInsertedDt: DataTypes.DATE,
    cssContractWid: DataTypes.INTEGER,
    pkid: DataTypes.INTEGER,
    contractId: DataTypes.INTEGER,
    contractStateSCode: DataTypes.STRING,
    dataSourcePCode: DataTypes.STRING,
    dataSourceSCode: DataTypes.STRING,
    startDt: DataTypes.DATE,
    endDt: DataTypes.DATE
  },
  {
    tableName: 'etlStageCssContracts',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageCssContracts
}
