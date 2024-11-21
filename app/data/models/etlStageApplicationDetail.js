module.exports = (sequelize, DataTypes) => {
  const etlStageApplicationDetail = sequelize.define('etlStageApplicationDetail', {
    change_type: DataTypes.STRING,
    change_time: DataTypes.DATE,
    etl_id: DataTypes.INTEGER,
    etl_inserted_dt: DataTypes.DATE,
    pkid: DataTypes.INTEGER,
    dt_insert: DataTypes.DATE,
    dt_delete: DataTypes.DATE,
    subject_id: DataTypes.INTEGER,
    ute_id: DataTypes.INTEGER,
    application_id: DataTypes.INTEGER,
    application_code: DataTypes.STRING,
    amended_app_id: DataTypes.INTEGER,
    app_type_id: DataTypes.INTEGER,
    proxy_id: DataTypes.INTEGER,
    status_p_code: DataTypes.STRING,
    status_s_code: DataTypes.STRING,
    source_p_code: DataTypes.STRING,
    source_s_code: DataTypes.STRING,
    dt_start: DataTypes.STRING,
    dt_end: DataTypes.STRING,
    valid_start_flg: DataTypes.STRING,
    valid_end_flg: DataTypes.STRING,
    app_id_start: DataTypes.INTEGER,
    app_id_end: DataTypes.INTEGER,
    dt_rec_update: DataTypes.DATE,
    user_id: DataTypes.STRING
  },
  {
    tableName: 'etl_stage_application_detail',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageApplicationDetail
}
