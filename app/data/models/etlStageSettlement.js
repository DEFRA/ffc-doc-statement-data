const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlStageSettlement = sequelize.define('etlStageSettlement', {
    settlementId: DataTypes.INTEGER,
    paymentRequestId: DataTypes.INTEGER,
    detail: DataTypes.STRING,
    invalid: DataTypes.BOOLEAN,
    generated: DataTypes.BOOLEAN,
    invoiceNumber: DataTypes.STRING,
    ledger: DataTypes.STRING,
    reference: DataTypes.STRING,
    settled: DataTypes.BOOLEAN,
    settlementDate: DataTypes.DATE,
    value: DataTypes.INTEGER,
    sourceSystem: DataTypes.STRING,
    frn: DataTypes.BIGINT,
    received: DataTypes.DATE
  },
  {
    tableName: 'etlStageSettlement',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageSettlement
}
