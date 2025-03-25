const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlStageApplicationDetail = sequelize.define('etlStageApplicationDetail', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    etlId: DataTypes.INTEGER,
    etlInsertedDt: DataTypes.DATE,
    pkid: DataTypes.INTEGER,
    dtInsert: DataTypes.DATE,
    dtDelete: DataTypes.DATE,
    subjectId: DataTypes.INTEGER,
    uteId: DataTypes.INTEGER,
    applicationId: DataTypes.INTEGER,
    applicationCode: DataTypes.STRING,
    amendedAppId: DataTypes.INTEGER,
    appTypeId: DataTypes.INTEGER,
    proxyId: DataTypes.INTEGER,
    statusPCode: DataTypes.STRING,
    statusSCode: DataTypes.STRING,
    sourcePCode: DataTypes.STRING,
    sourceSCode: DataTypes.STRING,
    dtStart: DataTypes.STRING,
    dtEnd: DataTypes.STRING,
    validStartFlg: DataTypes.STRING,
    validEndFlg: DataTypes.STRING,
    appIdStart: DataTypes.INTEGER,
    appIdEnd: DataTypes.INTEGER,
    dtRecUpdate: DataTypes.DATE,
    userId: DataTypes.STRING
  },
  {
    tableName: 'etlStageApplicationDetail',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageApplicationDetail
}
