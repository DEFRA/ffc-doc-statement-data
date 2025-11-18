const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const comment = "Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format"
const commentDate = "Example Output: 2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format"

module.exports = (sequelize, DataTypes) => {
  const etlStageSettlement = sequelize.define('etlStageSettlement', {
    settlementId: { type: DataTypes.INTEGER, comment},
    paymentRequestId: { type: DataTypes.INTEGER, comment},
    detail: { type: DataTypes.STRING, comment},
    invalid: { type: DataTypes.BOOLEAN, comment},
    generated: { type: DataTypes.BOOLEAN, comment},
    invoiceNumber: { type: DataTypes.STRING, comment},
    ledger: { type: DataTypes.STRING, comment},
    reference: { type: DataTypes.STRING, comment},
    settled: { type: DataTypes.BOOLEAN, comment},
    settlementDate: { type: DataTypes.DATE, comment: commentDate },
    value: { type: DataTypes.INTEGER, comment},
    sourceSystem: { type: DataTypes.STRING, comment},
    frn: { type: DataTypes.BIGINT, comment},
    received: { type: DataTypes.DATE, comment: commentDate }
  },
  {
    tableName: 'etlStageSettlement',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageSettlement
}
