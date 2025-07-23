const config = require('../../config')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const totalDataModel = require('../../constants/total-data-model')(DataTypes)
  const total = sequelize.define('total', totalDataModel,
    {
      tableName: 'totals',
      freezeTableName: true,
      timestamps: false,
      schema: dbConfig.schema
    })
  total.associate = function (models) {
    total.hasMany(models.dax, {
      foreignKey: 'calculationId',
      as: 'daxEntries'
    })
    total.hasMany(models.action, {
      foreignKey: 'calculationId',
      as: 'actions'
    })
    total.belongsTo(models.organisation, {
      foreignKey: 'sbi',
      as: 'organisations'
    })
  }
  return total
}
