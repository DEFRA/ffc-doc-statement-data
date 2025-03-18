module.exports = (sequelize, DataTypes) => {
  const etlIntermFinanceDax = sequelize.define('etlIntermFinanceDax', {
    transdate: DataTypes.DATE,
    invoiceid: DataTypes.STRING,
    scheme: DataTypes.INTEGER,
    fund: DataTypes.STRING,
    marketingyear: DataTypes.INTEGER,
    month: DataTypes.STRING,
    quarter: DataTypes.STRING,
    transactionAmount: DataTypes.DECIMAL,
    agreementreference: DataTypes.STRING,
    sitiInvoiceId: DataTypes.INTEGER,
    claimId: DataTypes.INTEGER,
    paymentRef: DataTypes.STRING,
    recid: DataTypes.BIGINT,
    etlInsertedDt: DataTypes.DATE
  }, {
    tableName: 'etlIntermFinanceDax',
    freezeTableName: true,
    timestamps: false
  })

  return etlIntermFinanceDax
}
