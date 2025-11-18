const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const comment = "Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format"
const commentDate = "Example Output: 2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format"

module.exports = (sequelize, DataTypes) => {
  const etlStageCssContracts = sequelize.define('etlStageCssContracts', {
    changeType: { type: DataTypes.STRING, comment},
    changeTime: { type: DataTypes.DATE, comment: commentDate},
    etlId: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, comment },
    etlInsertedDt: { type: DataTypes.DATE, comment: commentDate},
    cssContractWid: { type: DataTypes.INTEGER, comment},
    pkid: { type: DataTypes.INTEGER, comment},
    contractId: { type: DataTypes.INTEGER, comment},
    contractStateSCode: { type: DataTypes.STRING, comment},
    dataSourcePCode: { type: DataTypes.STRING, comment},
    dataSourceSCode: { type: DataTypes.STRING, comment},
    startDt: { type: DataTypes.DATE, comment: commentDate},
    endDt: { type: DataTypes.DATE, comment: commentDate}
  },
  {
    tableName: 'etlStageCssContracts',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageCssContracts
}
