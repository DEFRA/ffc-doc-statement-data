const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const comment = 'Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'
const commentDate = 'Example Output: 2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'

module.exports = (sequelize, DataTypes) => {
  const etlStageCalculationDetails = sequelize.define('etlStageCalculationDetails', {
    changeType: { type: DataTypes.STRING, comment },
    changeTime: { type: DataTypes.DATE, comment: commentDate },
    etlId: { type: { type: DataTypes.INTEGER, comment }, primaryKey: true, allowNull: false },
    etlInsertedDt: { type: DataTypes.DATE, comment: commentDate },
    applicationId: { type: DataTypes.INTEGER, comment },
    idClcHeader: { type: DataTypes.INTEGER, comment },
    calculationId: { type: DataTypes.INTEGER, comment },
    calculationDt: { type: DataTypes.DATE, comment: commentDate },
    ranked: { type: DataTypes.INTEGER, comment }
  },
  {
    tableName: 'etlStageCalculationDetails',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageCalculationDetails
}
