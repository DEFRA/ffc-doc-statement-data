const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const comment = 'Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'
const commentDate = 'Example Output: 2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'

module.exports = (sequelize, DataTypes) => {
  const etlStageOrganisation = sequelize.define('etlStageOrganisation', {
    changeType: { type: DataTypes.STRING, comment },
    changeTime: { type: DataTypes.DATE, comment: commentDate },
    etlId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, comment },
    etlInsertedDt: { type: DataTypes.DATE, comment: commentDate },
    organisationWid: { type: DataTypes.INTEGER, comment },
    partyId: { type: DataTypes.INTEGER, comment },
    sbi: { type: DataTypes.INTEGER, comment },
    lastUpdatedOn: { type: DataTypes.DATE, comment: commentDate }
  },
  {
    tableName: 'etlStageOrganisation',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageOrganisation
}
