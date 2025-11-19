const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const comment = 'Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'
const commentDate = 'Example Output: 2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'

module.exports = (sequelize, DataTypes) => {
  const etlIntermTotalZeroValues = sequelize.define('etlIntermTotalZeroValues', {
    paymentRef: { type: DataTypes.STRING, comment },
    quarter: { type: DataTypes.STRING, comment },
    totalAmount: { type: DataTypes.DECIMAL, commentDate },
    transdate: { type: DataTypes.DATE, commentDate },
    calculationId: { type: DataTypes.BIGINT, commentDate },
    invoiceid: { type: DataTypes.STRING, comment },
    etlInsertedDt: { type: DataTypes.DATE, commentDate },
    marketingyear: { type: DataTypes.INTEGER, commentDate }
  }, {
    tableName: 'etlIntermTotalZeroValues',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })

  return etlIntermTotalZeroValues
}
