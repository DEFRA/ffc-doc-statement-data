module.exports = (sequelize, DataTypes) => {
  const etlStageAppCalcResultsDelinkPayment = sequelize.define('etlStageAppCalcResultsDelinkPayment', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    etlId: DataTypes.INTEGER,
    etlInsertedDt: DataTypes.DATE,
    calculationId: DataTypes.INTEGER,
    variableName: DataTypes.STRING,
    progLine: DataTypes.INTEGER,
    value: DataTypes.STRING
  },
  {
    tableName: 'etlStageAppCalcResultsDelinkPayments',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageAppCalcResultsDelinkPayment
}
