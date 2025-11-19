const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const comment = 'Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'
const commentDate = 'Example Output: 2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'

module.exports = (sequelize, DataTypes) => {
  const etlIntermPaymentrefAgreementDates = sequelize.define('etlIntermPaymentrefAgreementDates', {
    paymentRef: { type: DataTypes.STRING, comment },
    agreementStart: { type: DataTypes.DATE, comment: commentDate },
    agreementEnd: { type: DataTypes.DATE, comment: commentDate },
    etlInsertedDt: { type: DataTypes.DATE, comment: commentDate }
  }, {
    tableName: 'etlIntermPaymentrefAgreementDates',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })

  return etlIntermPaymentrefAgreementDates
}
