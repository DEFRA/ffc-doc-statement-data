module.exports = (sequelize, DataTypes) => {
  const etlStageCssContracts = sequelize.define('etlStageCssContracts', {
    change_type: DataTypes.STRING,
    change_time: DataTypes.DATE,
    etl_id: DataTypes.INTEGER,
    etl_inserted_dt: DataTypes.DATE,
    css_contract_wid: DataTypes.INTEGER,
    pkid: DataTypes.INTEGER,
    insert_dt: DataTypes.DATE,
    delete_dt: DataTypes.DATE,
    contract_id: DataTypes.INTEGER,
    contract_code: DataTypes.STRING,
    contract_type_id: DataTypes.INTEGER,
    contract_type_description: DataTypes.STRING,
    contract_description: DataTypes.STRING,
    contract_state_p_code: DataTypes.STRING,
    contract_state_s_code: DataTypes.STRING,
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
    tableName: 'etl_stage_css_contracts',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageCssContracts
}
