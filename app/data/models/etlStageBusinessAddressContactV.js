const config = require('../../config')
const databaseFields = require('../../constants/business-address-shared/database-fields')
const dbConfig = config.dbConfig[config.env]
const comment = 'Example Output: Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'
const commentDate = 'Example Output: 2024-02-09 00:00:00 Source: DWH | SitiAgri Used on Statement? No, used our ETL service to transform DWH data into our required format'

module.exports = (sequelize, DataTypes) => {
  const etlStageBusinessAddressContactV = sequelize.define('etlStageBusinessAddressContactV', {
    changeType: { type: DataTypes.STRING, comment },
    changeTime: { type: DataTypes.DATE, comment: commentDate },
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
