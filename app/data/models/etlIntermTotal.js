const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const comment = 'Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'
const commentDate = 'Example Output: 2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'

module.exports = (sequelize, DataTypes) => {
  const etlIntermTotal = sequelize.define('etlIntermTotal', {
    paymentRef: { type: DataTypes.STRING, comment },
    quarter: { type: DataTypes.STRING, comment },
    totalAmount: { type: DataTypes.DECIMAL, comment },
    transdate: { type: DataTypes.DATE, comment: commentDate },
    calculationId: { type: DataTypes.BIGINT, comment },
    invoiceid: { type: DataTypes.STRING, comment },
    etlInsertedDt: { type: DataTypes.DATE, comment: commentDate },
    marketingyear: { type: DataTypes.INTEGER, comment }
  }, {
    tableName: 'etlIntermTotal',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })

  return etlIntermTotal
}
