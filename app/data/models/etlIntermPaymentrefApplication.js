const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlIntermPaymentrefApplication = sequelize.define('etlIntermPaymentrefApplication', {
    paymentRef: DataTypes.STRING,
    applicationId: DataTypes.INTEGER,
    etlInsertedDt: DataTypes.DATE
  }, {
    tableName: 'etlIntermPaymentrefApplication',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })

  return etlIntermPaymentrefApplication
}
