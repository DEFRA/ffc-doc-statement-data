const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const comment = "Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format"
const commentDate = "Example Output: 2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format"

module.exports = (sequelize, DataTypes) => {
  const etlIntermPaymentrefApplication = sequelize.define('etlIntermPaymentrefApplication', {
    paymentRef: { type: DataTypes.STRING, comment },
    applicationId: { type: DataTypes.INTEGER, comment },
    etlInsertedDt: { type: DataTypes.DATE, comment: commentDate }
  }, {
    tableName: 'etlIntermPaymentrefApplication',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })

  return etlIntermPaymentrefApplication
}
