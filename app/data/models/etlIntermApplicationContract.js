module.exports = (sequelize, DataTypes) => {
  const etlIntermApplicationContract = sequelize.define('etlIntermApplicationContract', {
    contractId: DataTypes.INTEGER,
    agreementStart: DataTypes.DATE,
    agreementEnd: DataTypes.DATE,
    applicationId: DataTypes.INTEGER,
    pkid: DataTypes.INTEGER,
    etlInsertedDt: DataTypes.DATE
  }, {
    tableName: 'etlIntermApplicationContract',
    freezeTableName: true,
    timestamps: false
  })

  return etlIntermApplicationContract
}
