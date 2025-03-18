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
    timestamps: false
  })

  return etlIntermApplicationPayment
}
