const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const comment = "Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format"
const commentDate = "Example Output: 2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format"

module.exports = (sequelize, DataTypes) => {
  const etlStageAppsPaymentNotification = sequelize.define('etlStageAppsPaymentNotification', {
    changeType: { type: DataTypes.STRING, comment},
    changeTime: { type: DataTypes.DATE, comment: commentDate},
    etlId: { type: { type: DataTypes.INTEGER, comment}, primaryKey: true, allowNull: false },
    etlInsertedDt: { type: DataTypes.DATE, comment: commentDate},
    applicationId: { type: DataTypes.INTEGER, comment},
    idClcHeader: { type: DataTypes.INTEGER, comment},
    notificationFlag: { type: DataTypes.STRING, comment},
    invoiceNumber: { type: DataTypes.STRING, comment}
  },
  {
    tableName: 'etlStageAppsPaymentNotification',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageAppsPaymentNotification
}
