const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const comment = 'Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'
const commentDate = 'Example Output: 2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'

const etlStageDay0Organisation = (sequelize, DataTypes) => {
  const databaseDefinition = sequelize.define('etlStageDay0Organisation', {
    etlId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, comment },
    etlInsertedDt: { type: DataTypes.DATE, comment: commentDate },
    organisationWid: { type: DataTypes.INTEGER, comment },
    partyId: { type: DataTypes.INTEGER, comment },
    sbi: { type: DataTypes.INTEGER, comment },
    lastUpdatedOn: { type: DataTypes.DATE, comment: commentDate }
  },
  {
    tableName: 'etlStageDay0Organisation',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return databaseDefinition
}

module.exports = etlStageDay0Organisation
