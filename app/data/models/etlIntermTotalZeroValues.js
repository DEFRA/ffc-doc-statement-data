const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlIntermTotalZeroValues = sequelize.define('etlIntermTotalZeroValues', {
    paymentRef: DataTypes.STRING,
    quarter: DataTypes.STRING,
    totalAmount: DataTypes.DECIMAL,
    transdate: DataTypes.DATE,
    calculationId: DataTypes.BIGINT,
    invoiceid: DataTypes.STRING,
    etlInsertedDt: DataTypes.DATE,
    marketingyear: DataTypes.INTEGER
  }, {
    tableName: 'etlIntermTotalZeroValues',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })

  return etlIntermTotalZeroValues
} 