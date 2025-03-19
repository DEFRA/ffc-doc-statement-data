const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlIntermApplicationClaim = sequelize.define('etlIntermApplicationClaim', {
    contractId: DataTypes.INTEGER,
    claimId: DataTypes.INTEGER,
    agreementId: DataTypes.INTEGER,
    pkid: DataTypes.INTEGER,
    etlInsertedDt: DataTypes.DATE
  }, {
    tableName: 'etlIntermApplicationClaim',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })

  return etlIntermApplicationClaim
}
