const config = require('../../config')
const dbConfig = config.dbConfig[config.env]
const comment = "Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format"
const commentDate = "Example Output: 2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format"

module.exports = (sequelize, DataTypes) => {
  const etlIntermOrg = sequelize.define('etlIntermOrg', {
    sbi: DataTypes.INTEGER,
    addressLine1: { type: DataTypes.STRING, comment },
    addressLine2: { type: DataTypes.STRING, comment },
    addressLine3: { type: DataTypes.STRING, comment },
    city: { type: DataTypes.STRING, comment },
    county: { type: DataTypes.STRING, comment },
    postcode: { type: DataTypes.STRING, comment },
    emailAddress: { type: DataTypes.STRING, comment },
    frn: { type: DataTypes.STRING, comment },
    name: { type: DataTypes.STRING, comment },
    partyId: { type: DataTypes.INTEGER, comment },
    updated: { type: DataTypes.DATE, comment: commentDate },
    etlInsertedDt: { type: DataTypes.DATE, comment: commentDate }
  }, {
    tableName: 'etlIntermOrg',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })

  return etlIntermOrg
}
