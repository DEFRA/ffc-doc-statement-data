module.exports = (sequelize, DataTypes) => {
  const etlStageAppsPaymentNotification = sequelize.define('etlStageAppsPaymentNotification', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    etlId: DataTypes.INTEGER,
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
    timestamps: false
  })
  return etlStageAppsPaymentNotification
}
