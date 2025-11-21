const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const comment = 'Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'

module.exports = (sequelize, DataTypes) => {
  const etlIntermApplicationPayment = sequelize.define('etlIntermApplicationPayment', {
    applicationId: { type: DataTypes.INTEGER, comment },
    invoiceNumber: { type: DataTypes.STRING, comment },
    invoiceId: { type: DataTypes.INTEGER, comment },
    idClcHeader: { type: DataTypes.INTEGER, comment },
    etlInsertedDt: { type: DataTypes.DATE, comment }
  }, {
    tableName: 'etlIntermApplicationPayment',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })

  return etlIntermApplicationPayment
}
