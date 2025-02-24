module.exports = (sequelize, DataTypes) => {
  const etlStageTdeLinkingTransferTransactions = sequelize.define('etlStageTdeLinkingTransferTransactions', {
    change_type: DataTypes.STRING,
    change_time: DataTypes.DATE,
    etl_id: DataTypes.INTEGER,
    etl_inserted_dt: DataTypes.DATE,
    transferor_sbi: DataTypes.STRING,
    transferor_cuaa: DataTypes.STRING,
    transferor_pk_cuaa: DataTypes.INTEGER,
    transferee_sbi: DataTypes.STRING,
    transferee_cuaa: DataTypes.STRING,
    transferee_pk_cuaa: DataTypes.INTEGER,
    total_amount_transferred: DataTypes.DOUBLE,
    transfer_amount: DataTypes.DOUBLE,
    transfer_amount_trans_in: DataTypes.DOUBLE,
    dt_insert: DataTypes.STRING,
    dt_delete: DataTypes.STRING,
    date_of_transfer: DataTypes.DATE,
    status_p_code: DataTypes.STRING,
    status_s_code: DataTypes.STRING,
    transfer_application_id: DataTypes.STRING,
    user_insert: DataTypes.STRING,
    user_delete: DataTypes.STRING,
    dt_update: DataTypes.STRING,
    data_source_p_code: DataTypes.STRING,
    data_source_s_code: DataTypes.STRING
  },
  {
    tableName: 'etl_stage_tde_linking_transfer_transactions',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageTdeLinkingTransferTransactions
}
