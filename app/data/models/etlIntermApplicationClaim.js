const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

const columnComment = "Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format"

module.exports = (sequelize, DataTypes) => {
  const etlIntermApplicationClaim = sequelize.define('etlIntermApplicationClaim', {
    contractId: { type: DataTypes.INTEGER, comment: columnComment },
    claimId: { type: DataTypes.INTEGER, comment: columnComment },
    agreementId: { type: DataTypes.INTEGER, comment: columnComment },
    pkid: { type: DataTypes.INTEGER, comment: columnComment },
    etlInsertedDt: {type: DataTypes.DATE, comment: "Example Output:  2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format" }
  }, {
    tableName: 'etlIntermApplicationClaim',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })

  return etlIntermApplicationClaim
}
