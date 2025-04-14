const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlStageAppsPaymentNotification = sequelize.define('etlStageAppsPaymentNotification', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    etlId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    etlInsertedDt: DataTypes.DATE,
    applicationId: DataTypes.INTEGER,
    idClcHeader: DataTypes.INTEGER,
    notificationFlag: DataTypes.STRING,
    invoiceNumber: DataTypes.STRING
  },
  {
    tableName: 'etlStageAppsPaymentNotification',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageAppsPaymentNotification
}
