module.exports = (sequelize, DataTypes) => {
  const etlStageTdeLinkingTransferTransactions = sequelize.define('etlStageTdeLinkingTransferTransactions', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    etlId: DataTypes.INTEGER,
    etlInsertedDt: DataTypes.DATE,
    transferorSbi: DataTypes.STRING,
    transferorCuaa: DataTypes.STRING,
    transferorPkCuaa: DataTypes.STRING,
    transfereeSbi: DataTypes.STRING,
    transfereeCuaa: DataTypes.STRING,
    transfereePkCuaa: DataTypes.STRING,
    totalAmountTransferred: DataTypes.DOUBLE,
    transferAmount: DataTypes.DOUBLE,
    transferAmountTransIn: DataTypes.DOUBLE,
    dtInsert: DataTypes.STRING,
    dtDelete: DataTypes.STRING,
    dateOfTransfer: DataTypes.DATE,
    statusPCode: DataTypes.STRING,
    statusSCode: DataTypes.STRING,
    transferApplicationId: DataTypes.STRING,
    userInsert: DataTypes.STRING,
    userDelete: DataTypes.STRING,
    dtUpdate: DataTypes.STRING,
    dataSourcePCode: DataTypes.STRING,
    dataSourceSCode: DataTypes.STRING
  },
  {
    tableName: 'etlStageTdeLinkingTransferTransactions',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageTdeLinkingTransferTransactions
}
