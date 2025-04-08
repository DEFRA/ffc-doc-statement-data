const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlStageCssContractApplications = sequelize.define('etlStageCssContractApplications', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    etlId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    etlInsertedDt: DataTypes.DATE,
    cssContractApplicationWid: DataTypes.INTEGER,
    pkid: DataTypes.INTEGER,
    contractId: DataTypes.INTEGER,
    applicationId: DataTypes.INTEGER,
    dataSourceSCode: DataTypes.STRING,
    startDt: DataTypes.DATE,
    endDt: DataTypes.DATE
  },
  {
    tableName: 'etlStageCssContractApplications',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageCssContractApplications
}
