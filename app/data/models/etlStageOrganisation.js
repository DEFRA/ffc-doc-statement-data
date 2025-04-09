const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlStageOrganisation = sequelize.define('etlStageOrganisation', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    etlId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
    etlInsertedDt: DataTypes.DATE,
    organisationWid: DataTypes.INTEGER,
    partyId: DataTypes.INTEGER,
    sbi: DataTypes.INTEGER,
    lastUpdatedOn: DataTypes.DATE
  },
  {
    tableName: 'etlStageOrganisation',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageOrganisation
}
