const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlStageCssContractApplications = sequelize.define('etlStageCssContractApplications', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    etlId: DataTypes.INTEGER,
    etlInsertedDt: DataTypes.DATE,
    cssContractApplicationWid: DataTypes.INTEGER,
    pkid: DataTypes.INTEGER,
    insertDt: DataTypes.DATE,
    deleteDt: DataTypes.DATE,
    contractId: DataTypes.INTEGER,
    applicationId: DataTypes.INTEGER,
    typePCode: DataTypes.STRING,
    typeSCode: DataTypes.STRING,
    dataSourcePCode: DataTypes.STRING,
    dataSourceSCode: DataTypes.STRING,
    startDt: DataTypes.DATE,
    endDt: DataTypes.DATE,
    validStartFlag: DataTypes.STRING,
    validEndFlag: DataTypes.STRING,
    startActId: DataTypes.INTEGER,
    endActId: DataTypes.INTEGER,
    lastUpdateDt: DataTypes.DATE,
    user: DataTypes.STRING
  },
  {
    tableName: 'etlStageCssContractApplications',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageCssContractApplications
}
