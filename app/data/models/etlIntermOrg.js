const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlIntermOrg = sequelize.define('etlIntermOrg', {
    sbi: DataTypes.INTEGER,
    addressLine1: DataTypes.STRING,
    addressLine2: DataTypes.STRING,
    addressLine3: DataTypes.STRING,
    city: DataTypes.STRING,
    county: DataTypes.STRING,
    postcode: DataTypes.STRING,
    emailAddress: DataTypes.STRING,
    frn: DataTypes.STRING,
    name: DataTypes.STRING,
    partyId: DataTypes.INTEGER,
    updated: DataTypes.DATE,
    etlInsertedDt: DataTypes.DATE
  }, {
    tableName: 'etlIntermOrg',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })

  return etlIntermOrg
}
