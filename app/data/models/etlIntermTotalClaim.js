const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlIntermTotalClaim = sequelize.define('etlIntermTotalClaim', {
    paymentRef: DataTypes.STRING,
    claimId: DataTypes.INTEGER,
    etlInsertedDt: DataTypes.DATE
  }, {
    tableName: 'etlIntermTotalClaim',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })

  return etlIntermTotalClaim
}
