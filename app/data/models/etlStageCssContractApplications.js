module.exports = (sequelize, DataTypes) => {
  const etlStageCssContractApplications = sequelize.define('etlStageCssContractApplications', {
    change_type: DataTypes.STRING,
    change_time: DataTypes.DATE,
    etl_id: DataTypes.INTEGER,
    etl_inserted_dt: DataTypes.DATE,
    css_contract_application_wid: DataTypes.INTEGER,
    pkid: DataTypes.INTEGER,
    insert_dt: DataTypes.DATE,
    delete_dt: DataTypes.DATE,
    contract_id: DataTypes.INTEGER,
    application_id: DataTypes.INTEGER,
    type_p_code: DataTypes.STRING,
    type_s_code: DataTypes.STRING,
    data_source_p_code: DataTypes.STRING,
    data_source_s_code: DataTypes.STRING,
    start_dt: DataTypes.DATE,
    end_dt: DataTypes.DATE,
    valid_start_flag: DataTypes.STRING,
    valid_end_flag: DataTypes.STRING,
    start_act_id: DataTypes.INTEGER,
    end_act_id: DataTypes.INTEGER,
    last_update_dt: DataTypes.DATE,
    user: DataTypes.STRING
  },
  {
    tableName: 'etl_stage_css_contract_applications',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageCssContractApplications
}
