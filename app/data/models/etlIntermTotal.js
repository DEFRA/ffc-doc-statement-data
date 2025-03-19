const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlIntermTotal = sequelize.define('etlIntermTotal', {
    paymentRef: DataTypes.STRING,
    quarter: DataTypes.STRING,
    totalAmount: DataTypes.DECIMAL,
    transdate: DataTypes.DATE,
    calculationId: DataTypes.BIGINT,
    invoiceid: DataTypes.STRING,
    etlInsertedDt: DataTypes.DATE
  }, {
    tableName: 'etlIntermTotal',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })

  return etlIntermTotal
}
