module.exports = (sequelize, DataTypes) => {
  const etlIntermTotalClaim = sequelize.define('etlIntermTotalClaim', {
    paymentRef: DataTypes.STRING,
    claimId: DataTypes.INTEGER,
    etlInsertedDt: DataTypes.DATE
  }, {
    tableName: 'etlIntermTotalClaim',
    freezeTableName: true,
    timestamps: false
  })

  return etlIntermTotalClaim
}
