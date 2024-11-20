module.exports = (sequelize, DataTypes) => {
  const etlStageCssOptions = sequelize.define('etlStageCssOptions', {
    change_type: DataTypes.STRING,
    change_time: DataTypes.DATE,
    etl_id: DataTypes.INTEGER,
    etl_inserted_dt: DataTypes.DATE,
    css_option_id: DataTypes.INTEGER,
    option_type_id: DataTypes.INTEGER,
    option_description: DataTypes.STRING,
    option_long_description: DataTypes.STRING,
    duration: DataTypes.INTEGER,
    option_code: DataTypes.STRING,
    contract_type_id: DataTypes.INTEGER,
    start_dt: DataTypes.DATE,
    end_dt: DataTypes.DATE,
    group_id: DataTypes.STRING
  },
  {
    tableName: 'etl_stage_css_options',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageCssOptions
}
