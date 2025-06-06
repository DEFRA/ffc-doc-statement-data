const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const funding = sequelize.define('funding', {
    fundingId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    calculationId: DataTypes.INTEGER,
    fundingCode: DataTypes.STRING,
    areaClaimed: DataTypes.DECIMAL,
    rate: DataTypes.DECIMAL
  },
  {
    tableName: 'fundings',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  funding.associate = function (models) {
    funding.belongsTo(models.calculation, {
      foreignKey: 'calculationId',
      as: 'calculations'
    })
  }
  return funding
}
