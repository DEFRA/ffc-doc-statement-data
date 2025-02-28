module.exports = (sequelize, DataTypes) => {
  const etlStageAppCalcResultsDelinkPayment = sequelize.define('etlStageAppCalcResultsDelinkPayment', {
    change_type: DataTypes.STRING,
    change_time: DataTypes.DATE,
    etl_id: DataTypes.INTEGER,
    etl_inserted_dt: DataTypes.DATE,
    calculation_id: DataTypes.INTEGER,
    variable_name: DataTypes.STRING,
    prog_line: DataTypes.INTEGER,
    value: DataTypes.STRING
  },
  {
    tableName: 'etl_stage_app_calc_results_delink_payments',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageAppCalcResultsDelinkPayment
}
