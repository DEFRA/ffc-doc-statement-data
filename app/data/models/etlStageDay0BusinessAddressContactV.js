const config = require('../../config')
const databaseFields = require('../../constants/business-address-shared/database-fields')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlStageDay0BusinessAddressContactV = sequelize.define('etlStageDay0BusinessAddressContactV', {
    ...databaseFields(DataTypes)
  },
  {
    tableName: 'etlStageDay0BusinessAddressContactV',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageDay0BusinessAddressContactV
}
