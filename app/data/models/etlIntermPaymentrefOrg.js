const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlIntermPaymentrefOrg = sequelize.define('etlIntermPaymentrefOrg', {
    paymentRef: DataTypes.STRING,
    sbi: DataTypes.STRING,
    frn: DataTypes.STRING,
    etlInsertedDt: DataTypes.DATE
  }, {
    tableName: 'etlIntermPaymentrefOrg',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })

  return etlIntermPaymentrefOrg
}
