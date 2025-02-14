module.exports = (sequelize, DataTypes) => {
  const etlStageAppsTypes = sequelize.define('etlStageAppsTypes', {
    change_type: DataTypes.STRING,
    change_time: DataTypes.DATE,
    etl_id: DataTypes.INTEGER,
    etl_inserted_dt: DataTypes.DATE,
    app_type_id: DataTypes.INTEGER,
    sector_p_code: DataTypes.STRING,
    sector_s_code: DataTypes.STRING,
    short_description: DataTypes.STRING,
    ext_description: DataTypes.STRING,
    year: DataTypes.INTEGER,
    win_open_date: DataTypes.DATE,
    win_close_date: DataTypes.DATE
  },
  {
    tableName: 'etl_stage_apps_types',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageAppsTypes
}
