const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const comment = 'Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'
const commentDate = 'Example Output: 2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'

module.exports = (sequelize, DataTypes) => {
  const etlIntermFinanceDax = sequelize.define('etlIntermFinanceDax', {
    transdate: { type: DataTypes.DATE, comment: commentDate },
    invoiceid: { type: DataTypes.STRING, comment },
    scheme: { type: DataTypes.INTEGER, comment },
    fund: { type: DataTypes.STRING, comment },
    marketingyear: { type: DataTypes.INTEGER, comment },
    month: { type: DataTypes.STRING, comment },
    quarter: { type: DataTypes.STRING, comment },
    transactionAmount: { type: DataTypes.DECIMAL, comment },
    agreementreference: { type: DataTypes.STRING, comment },
    sitiInvoiceId: { type: DataTypes.INTEGER, comment },
    claimId: { type: DataTypes.INTEGER, comment },
    paymentRef: { type: DataTypes.STRING, comment },
    recid: { type: DataTypes.BIGINT, comment },
    etlInsertedDt: { type: DataTypes.DATE, comment: commentDate }
  }, {
    tableName: 'etlIntermFinanceDax',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })

  return etlIntermFinanceDax
}
