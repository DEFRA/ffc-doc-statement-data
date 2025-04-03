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
    notificationDt: DataTypes.DATE,
    notificationFlag: DataTypes.STRING,
    notifierKey: DataTypes.DECIMAL,
    notificationText: DataTypes.STRING,
    invoiceNumber: DataTypes.STRING,
    requestInvoiceNumber: DataTypes.STRING,
    pillar: DataTypes.STRING,
    deliveryBodyCode: DataTypes.STRING,
    paymentPreferenceCurrency: DataTypes.STRING
  },
  {
    tableName: 'etlStageAppsPaymentNotification',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageAppsPaymentNotification
}
