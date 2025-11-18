const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const comment = "Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format"
const commentDate = "Example Output: 2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format"

module.exports = (sequelize, DataTypes) => {
  const etlStageCssContractApplications = sequelize.define('etlStageCssContractApplications', {
    changeType: { type: DataTypes.STRING, comment},
    changeTime: { type: DataTypes.DATE, comment: commentDate},//TODO FIX!!
    etlId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, comment },
    etlInsertedDt: { type: DataTypes.DATE, comment: commentDate},
    cssContractApplicationWid: { type: DataTypes.INTEGER, comment},
    pkid: { type: DataTypes.INTEGER, comment},
    contractId: { type: DataTypes.INTEGER, comment},
    applicationId: { type: DataTypes.INTEGER, comment},
    dataSourceSCode: { type: DataTypes.STRING, comment},
    startDt: { type: DataTypes.DATE, comment: commentDate},
    endDt: { type: DataTypes.DATE, comment: commentDate}
  },
  {
    tableName: 'etlStageCssContractApplications',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageCssContractApplications
}
