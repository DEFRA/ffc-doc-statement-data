module.exports = (sequelize, DataTypes) => {
  const etlStageBusinessAddressContactV = sequelize.define('etlStageBusinessAddressContactV', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    etlId: DataTypes.INTEGER,
    etlInsertedDt: DataTypes.DATE,
    sbi: DataTypes.INTEGER,
    frn: DataTypes.STRING,
    businessName: DataTypes.STRING,
    accountablePeopleCompleted: DataTypes.DECIMAL,
    financialToBusinessAddr: DataTypes.DECIMAL,
    corrAsBusinessAddr: DataTypes.DECIMAL,
    businessAddress1: DataTypes.STRING,
    businessAddress2: DataTypes.STRING,
    businessAddress3: DataTypes.STRING,
    businessCity: DataTypes.STRING,
    businessCounty: DataTypes.STRING,
    businessPostCode: DataTypes.STRING,
    businessLandline: DataTypes.STRING,
    businessMobile: DataTypes.STRING,
    businessEmailAddr: DataTypes.STRING,
    correspondenceAddress1: DataTypes.STRING,
    correspondenceAddress2: DataTypes.STRING,
    correspondenceAddress3: DataTypes.STRING,
    correspondenceCity: DataTypes.STRING,
    correspondenceCounty: DataTypes.STRING,
    correspondencePostCode: DataTypes.STRING,
    correspondenceLandline: DataTypes.STRING,
    correspondenceMobile: DataTypes.STRING,
    correspondenceEmailAddr: DataTypes.STRING
  },
  {
    tableName: 'etlStageBusinessAddressContactV',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageBusinessAddressContactV
}
