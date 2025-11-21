const comment = 'Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'
const commentDate = 'Example Output: 2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'

module.exports = (sequelize, DataTypes) => {
  const etlStageTdeLinkingTransferTransactions = sequelize.define('etlStageTdeLinkingTransferTransactions', {
    changeType: { type: DataTypes.STRING, comment },
    changeTime: { type: DataTypes.DATE, comment: commentDate },
    etlId: { type: DataTypes.INTEGER, comment },
    etlInsertedDt: { type: DataTypes.DATE, comment: commentDate },
    transferorSbi: { type: DataTypes.STRING, comment },
    transferorCuaa: { type: DataTypes.STRING, comment },
    transferorPkCuaa: { type: DataTypes.STRING, comment },
    transfereeSbi: { type: DataTypes.STRING, comment },
    transfereeCuaa: { type: DataTypes.STRING, comment },
    transfereePkCuaa: { type: DataTypes.STRING, comment },
    totalAmountTransferred: { type: DataTypes.DOUBLE, comment },
    transferAmount: { type: DataTypes.DOUBLE, comment },
    transferAmountTransIn: { type: DataTypes.DOUBLE, comment },
    dtInsert: { type: DataTypes.STRING, comment },
    dtDelete: { type: DataTypes.STRING, comment },
    dateOfTransfer: { type: DataTypes.DATE, comment: commentDate },
    statusPCode: { type: DataTypes.STRING, comment },
    statusSCode: { type: DataTypes.STRING, comment },
    transferApplicationId: { type: DataTypes.STRING, comment },
    userInsert: { type: DataTypes.STRING, comment },
    userDelete: { type: DataTypes.STRING, comment },
    dtUpdate: { type: DataTypes.STRING, comment },
    dataSourcePCode: { type: DataTypes.STRING, comment },
    dataSourceSCode: { type: DataTypes.STRING, comment }
  },
  {
    tableName: 'etlStageTdeLinkingTransferTransactions',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageTdeLinkingTransferTransactions
}
