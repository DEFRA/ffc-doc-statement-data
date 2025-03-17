module.exports = (sequelize, DataTypes) => {
  const etlStageOrganisation = sequelize.define('etlStageOrganisation', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    etlId: DataTypes.INTEGER,
    etlInsertedDt: DataTypes.DATE,
    organisationWid: DataTypes.INTEGER,
    partyId: DataTypes.INTEGER,
    organisationName: DataTypes.STRING,
    confirmedFlg: DataTypes.INTEGER,
    landConfirmedFlg: DataTypes.INTEGER,
    sbi: DataTypes.INTEGER,
    taxRegistrationNumber: DataTypes.STRING,
    legalStatusTypeId: DataTypes.INTEGER,
    businessReference: DataTypes.STRING,
    businessTypeId: DataTypes.INTEGER,
    vendorNumber: DataTypes.STRING,
    landDetailsConfirmedDtKey: DataTypes.INTEGER,
    businessDetConfirmedDtKey: DataTypes.INTEGER,
    registrationDate: DataTypes.STRING,
    charityCommissionRegnum: DataTypes.STRING,
    companiesHouseRegnum: DataTypes.STRING,
    additionalBusinesses: DataTypes.INTEGER,
    amended: DataTypes.INTEGER,
    traderNumber: DataTypes.STRING,
    dateStartedFarming: DataTypes.STRING,
    accountablePeopleCompleted: DataTypes.INTEGER,
    financialToBusinessAddr: DataTypes.INTEGER,
    corrAsBusinessAddr: DataTypes.INTEGER,
    lastUpdatedOn: DataTypes.DATE
  },
  {
    tableName: 'etlStageOrganisation',
    freezeTableName: true,
    timestamps: false
  })
  return etlStageOrganisation
}
