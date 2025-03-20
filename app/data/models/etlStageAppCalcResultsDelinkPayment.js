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
    tableName: 'etl_stage_app_calc_results_delink_payments',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageAppCalcResultsDelinkPayment
}
