const config = require('../../config')
const databaseFields = require('../../constants/business-address-shared/database-fields')
const dbConfig = config.dbConfig[config.env]

module.exports = (sequelize, DataTypes) => {
  const etlStageBusinessAddressContactV = sequelize.define('etlStageBusinessAddressContactV', {
    changeType: DataTypes.STRING,
    changeTime: DataTypes.DATE,
    ...databaseFields(DataTypes)
  },
  {
    tableName: 'etlStageBusinessAddressContactV',
    freezeTableName: true,
    timestamps: false,
    schema: dbConfig.schema
  })
  return etlStageBusinessAddressContactV
}
