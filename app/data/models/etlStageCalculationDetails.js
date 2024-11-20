module.exports = (sequelize, DataTypes) => {
  const etlStageCalculationDetails = sequelize.define('etlStageCalculationDetails', {
    change_type: DataTypes.STRING,
    change_time: DataTypes.DATE,
    etl_id: DataTypes.INTEGER,
    etl_inserted_dt: DataTypes.DATE,
    application_id: DataTypes.INTEGER,
    id_clc_header: DataTypes.INTEGER,
    calculation_id: DataTypes.INTEGER,
    calculation_dt: DataTypes.DATE,
    ranked: DataTypes.INTEGER
  },
  {
    tableName: 'etl_stage_calculation_details',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageCalculationDetails
}
