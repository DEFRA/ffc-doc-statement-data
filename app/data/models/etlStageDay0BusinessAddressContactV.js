const config = require('../../config')
const databaseFields = require('../../constants/business-address-shared/database-fields')
const dbConfig = config.dbConfig[config.env]

const etlStageDay0BusinessAddressContactV = (sequelize, DataTypes) => {
  const databaseDefinition = sequelize.define('etlStageDay0BusinessAddressContactV', {
    ...databaseFields(DataTypes)
  },
  {
    tableName: 'etlStageDay0BusinessAddressContactV',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return databaseDefinition
}

module.exports = etlStageDay0BusinessAddressContactV
