module.exports = (sequelize, DataTypes) => {
  const etlIntermPaymentrefApplication = sequelize.define('etlIntermPaymentrefApplication', {
    paymentRef: DataTypes.STRING,
    applicationId: DataTypes.INTEGER,
    etlInsertedDt: DataTypes.DATE
  }, {
    tableName: 'etlIntermPaymentrefApplication',
    freezeTableName: true,
    timestamps: false
  })

  return etlIntermPaymentrefApplication
}
