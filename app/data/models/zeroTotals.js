const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const totalDataModel = require('../../constants/total-data-model')(DataTypes)
  const zeroTotal = sequelize.define('zeroTotal', totalDataModel,
    {
      tableName: 'zeroTotals',
      freezeTableName: true,
      timestamps: false,
      schema: dbConfig.schema
    })
  zeroTotal.associate = function (models) {
    zeroTotal.hasMany(models.dax, {
      foreignKey: 'calculationId',
      as: 'daxEntries'
    })
    zeroTotal.hasMany(models.action, {
      foreignKey: 'calculationId',
      as: 'actions'
    })
    zeroTotal.belongsTo(models.organisation, {
      foreignKey: 'sbi',
      as: 'organisations'
    })
  }
  return zeroTotal
}
