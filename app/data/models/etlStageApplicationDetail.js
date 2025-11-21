const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const comment = 'Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'
const commentDate = 'Example Output: 2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'

module.exports = (sequelize, DataTypes) => {
  const etlStageApplicationDetail = sequelize.define('etlStageApplicationDetail', {
    changeType: { type: DataTypes.STRING, comment },
    changeTime: { type: DataTypes.DATE, comment: commentDate },
    etlId: { type: DataTypes.INTEGER, comment, primaryKey: true, allowNull: false },
    etlInsertedDt: { type: DataTypes.DATE, commentDate },
    pkid: { type: DataTypes.INTEGER, comment },
    applicationId: { type: DataTypes.INTEGER, comment },
    subjectId: { type: DataTypes.INTEGER, comment }
  },
  {
    tableName: 'etlStageApplicationDetail',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageApplicationDetail
}
