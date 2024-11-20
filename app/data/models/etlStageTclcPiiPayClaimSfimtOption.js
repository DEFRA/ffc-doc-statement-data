module.exports = (sequelize, DataTypes) => {
  const etlStageTclcPiiPayClaimSfimtOption = sequelize.define('etlStageTclcPiiPayClaimSfimtOption', {
    change_type: DataTypes.STRING,
    change_time: DataTypes.DATE,
    etl_id: DataTypes.INTEGER,
    etl_inserted_dt: DataTypes.DATE,
    tclc_pii_pay_claim_sfimt_option_wid: DataTypes.INTEGER,
    application_id: DataTypes.INTEGER,
    calculation_id: DataTypes.INTEGER,
    op_code: DataTypes.STRING,
    sco_uom: DataTypes.STRING,
    commitment: DataTypes.DECIMAL,
    commitment_val: DataTypes.DECIMAL,
    agree_amount: DataTypes.DECIMAL,
    claimed_pay_amount: DataTypes.DECIMAL,
    verify_pay_amount: DataTypes.DECIMAL,
    found_amount: DataTypes.DECIMAL,
    overd_reduct_amount: DataTypes.DECIMAL,
    overd_penalty_amount: DataTypes.DECIMAL,
    net1_amount: DataTypes.DECIMAL
  },
  {
    tableName: 'etl_stage_tclc_pii_pay_claim_sfimt_option',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageTclcPiiPayClaimSfimtOption
}
