module.exports = (sequelize, DataTypes) => {
  const etlIntermPaymentrefAgreementDates = sequelize.define('etlIntermPaymentrefAgreementDates', {
    paymentRef: DataTypes.STRING,
    agreementStart: DataTypes.DATE,
    agreementEnd: DataTypes.DATE,
    etlInsertedDt: DataTypes.DATE
  }, {
    tableName: 'etlIntermPaymentrefAgreementDates',
    freezeTableName: true,
    timestamps: false
  })

  return etlIntermPaymentrefAgreementDates
}
