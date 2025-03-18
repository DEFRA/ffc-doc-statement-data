module.exports = (sequelize, DataTypes) => {
  const etlIntermCalcOrg = sequelize.define('etlIntermCalcOrg', {
    applicationId: DataTypes.INTEGER,
    calculationId: DataTypes.INTEGER,
    calculationDate: DataTypes.DATE,
    sbi: DataTypes.INTEGER,
    frn: DataTypes.STRING,
    idClcHeader: DataTypes.INTEGER,
    etlInsertedDt: DataTypes.DATE
  }, {
    tableName: 'etlIntermCalcOrg',
    freezeTableName: true,
    timestamps: false
  })

  return etlIntermCalcOrg
}
