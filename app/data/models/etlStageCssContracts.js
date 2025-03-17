module.exports = (sequelize, DataTypes) => {
  const etlStageCssContracts = sequelize.define('etlStageCssContracts', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    etlId: DataTypes.INTEGER,
    etlInsertedDt: DataTypes.DATE,
    cssContractWid: DataTypes.INTEGER,
    pkid: DataTypes.INTEGER,
    insertDt: DataTypes.DATE,
    deleteDt: DataTypes.DATE,
    contractId: DataTypes.INTEGER,
    contractCode: DataTypes.STRING,
    contractTypeId: DataTypes.INTEGER,
    contractTypeDescription: DataTypes.STRING,
    contractDescription: DataTypes.STRING,
    contractStatePCode: DataTypes.STRING,
    contractStateSCode: DataTypes.STRING,
    dataSourcePCode: DataTypes.STRING,
    dataSourceSCode: DataTypes.STRING,
    startDt: DataTypes.DATE,
    endDt: DataTypes.DATE,
    validStartFlag: DataTypes.STRING,
    validEndFlag: DataTypes.STRING,
    startActId: DataTypes.INTEGER,
    endActId: DataTypes.INTEGER,
    lastUpdateDt: DataTypes.DATE,
    user: DataTypes.STRING
  },
  {
    tableName: 'etlStageCssContracts',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageCssContracts
}
