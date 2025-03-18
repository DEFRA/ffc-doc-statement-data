module.exports = (sequelize, DataTypes) => {
  const etlStageTclcPiiPayClaimSfimtOption = sequelize.define('etlStageTclcPiiPayClaimSfimtOption', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    etlId: DataTypes.INTEGER,
    etlInsertedDt: DataTypes.DATE,
    tclcPiiPayClaimSfimtOptionWid: DataTypes.INTEGER,
    applicationId: DataTypes.INTEGER,
    calculationId: DataTypes.INTEGER,
    opCode: DataTypes.STRING,
    scoUom: DataTypes.STRING,
    commitment: DataTypes.DECIMAL,
    commitmentVal: DataTypes.DECIMAL,
    agreeAmount: DataTypes.DECIMAL,
    claimedPayAmount: DataTypes.DECIMAL,
    verifyPayAmount: DataTypes.DECIMAL,
    foundAmount: DataTypes.DECIMAL,
    overdReductAmount: DataTypes.DECIMAL,
    overdPenaltyAmount: DataTypes.DECIMAL,
    net1Amount: DataTypes.DECIMAL
  },
  {
    tableName: 'etlStageTclcPiiPayClaimSfimtOption',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageTclcPiiPayClaimSfimtOption
}
