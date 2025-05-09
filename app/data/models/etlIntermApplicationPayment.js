const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlIntermApplicationPayment = sequelize.define('etlIntermApplicationPayment', {
    applicationId: DataTypes.INTEGER,
    invoiceNumber: DataTypes.STRING,
    invoiceId: DataTypes.INTEGER,
    idClcHeader: DataTypes.INTEGER,
    etlInsertedDt: DataTypes.DATE
  }, {
    tableName: 'etlIntermApplicationPayment',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })

  return etlIntermApplicationPayment
}
