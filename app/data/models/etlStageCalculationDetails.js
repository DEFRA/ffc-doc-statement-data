module.exports = (sequelize, DataTypes) => {
  const etlStageCalculationDetails = sequelize.define('etlStageCalculationDetails', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    etlId: DataTypes.INTEGER,
    etlInsertedDt: DataTypes.DATE,
    applicationId: DataTypes.INTEGER,
    idClcHeader: DataTypes.INTEGER,
    calculationId: DataTypes.INTEGER,
    calculationDt: DataTypes.DATE,
    ranked: DataTypes.INTEGER
  },
  {
    tableName: 'etlStageCalculationDetails',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageCalculationDetails
}
