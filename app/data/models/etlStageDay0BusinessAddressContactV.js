const config = require('../../config')
const databaseFields = require('../../constants/business-address-shared/database-fields')
const dbConfig = config.dbConfig[config.env]

const etlStageDay0BusinessAddressContactV = (sequelize, DataTypes) => {
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

module.exports = etlStageDay0BusinessAddressContactV
