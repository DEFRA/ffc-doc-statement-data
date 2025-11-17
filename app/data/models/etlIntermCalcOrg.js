const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const comment = "Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format"
const commentDate = "Example Output: 2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format"

module.exports = (sequelize, DataTypes) => {
  const etlIntermCalcOrg = sequelize.define('etlIntermCalcOrg', {
    applicationId: { type: DataTypes.INTEGER, comment },
    calculationId:{ type: DataTypes.INTEGER, comment },
    calculationDate: { type: DataTypes.DATE, comment: commentDate },
    sbi: { type: DataTypes.INTEGER, comment },
    frn: { type: DataTypes.STRING, comment },
    idClcHeader: { type: DataTypes.INTEGER, comment },
    etlInsertedDt:{ type: DataTypes.DATE, comment: commentDate },
  }, {
    tableName: 'etlIntermCalcOrg',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })

  return etlIntermCalcOrg
}
